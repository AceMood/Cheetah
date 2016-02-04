/**
 * Created by baidu on 16/1/27.
 */

'use strict';

var ipc = require('node-ipc');

ipc.config.id = 'hello';
ipc.config.appspace = 'cache.';
ipc.config.retry = 1000;
ipc.config.stopRetrying = true;
ipc.config.maxRetries = 0;
ipc.config.sync = true;

const COMMAND = {
  QUERY: 1,
  PUSH: 2,
  DEL: 3
};

let threw = false;

// boot process
function boot() {
  let node_path = require('path');
  let cp = require('child_process');

  const fs = require('fs');
  const spawn = cp.spawn;

  const child = spawn('node', [node_path.join(__dirname, 'server.js')], {
    detached: true,
    stdio: 'ignore'
  });

  child.unref();
}

// send message to cache process
function sendMessage() {
  // emit client event
  ipc.of.world.emit('app.message',
    {
      id: ipc.config.id,
      message: JSON.stringify({
        command: COMMAND.QUERY,
        key: '.cache'
        //value: {isModule: true, requiredJS: ['base']}
      })
    });
}

// try to connect
function tryConnect() {

  ipc.connectTo('world', function() {

    ipc.of.world.on('connect', function() {
      sendMessage();
    });

    ipc.of.world.on('disconnect', function() {
      ipc.log('disconnected from world'.notice);
    });

    ipc.of.world.on('error', function(err) {
      if (threw) return;

      if (err.errno === 'ENOENT'
        || err.errno === 'ECONNREFUSED') {
        threw = true;

        boot();
        tryConnect();
      } else {
        throw err;
      }
    });

    ipc.of.world.on('app.message', function(data) {
      ipc.log('got a message from world : '.debug, data);
    });

    //console.log(ipc.of.world.destroy);
  });
}

tryConnect();
