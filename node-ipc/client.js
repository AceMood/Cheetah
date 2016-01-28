/**
 * Created by baidu on 16/1/27.
 */

'use strict';

var ipc = require('node-ipc');
var argv = require('./argv');
var args = argv.parse(process.argv);

ipc.config.id = 'hello';
ipc.config.appspace = 'cache.';
ipc.config.retry = 1000;
ipc.config.maxRetries = 3;
ipc.config.sync = true;

const COMMAND = {
  QUERY: 1,
  PUSH: 2,
  DEL: 3
};

// boot process
function boot() {
  let node_path = require('path');
  let cp = require('child_process');

  const fs = require('fs');
  const spawn = cp.spawn;
  const out = fs.openSync('./out.log', 'a');
  const err = fs.openSync('./out.log', 'a');

  const child = spawn('node', [node_path.join(__dirname, 'server.js')], {
    detached: true,
    stdio: [ 'ignore', out, err ]
  });

  child.unref();
}

// try to connect
function tryConnect() {
  ipc.connectTo('world', function() {
    ipc.of.world.on('connect', function() {
      ipc.log('## connected to world ##', ipc.config.delay);

      // emit client event
      ipc.of.world.emit('app.message',
        {
          id: ipc.config.id,
          message: JSON.stringify({
            command: COMMAND.QUERY,
            key: 'zmike'
          })
        });
    });

    //ipc.of.world.on('disconnect', function() {
    //  ipc.log('disconnected from world'.notice);
    //});

    ipc.of.world.on('app.message', function(data) {
      ipc.log('got a message from world : '.debug, data);
    });

    console.log(ipc.of.world.destroy);
  });
}

try {
  tryConnect();
} catch (err) {
  boot();
  tryConnect();
}
