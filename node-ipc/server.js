/**
 * Created by baidu on 16/1/27.
 */

'use strict';

var ipc = require('node-ipc');

ipc.config.id = 'world';
ipc.config.appspace = 'cache.';
ipc.config.retry = 1500;
ipc.config.sync = true;


let cache = Object.create(null);

// Used to create local Unix Socket Server or Windows Socket Server to which Clients can bind.
// The server can emit events to specific Client Sockets, or broadcast events to all known Client Sockets.
ipc.serve(function() {
  ipc.server.on('app.message', function(data, socket) {
    //ipc.log('got a message from'.debug, (data.id).variable, (data.message).data);

    var d = JSON.parse(data.message);

    switch (d.command) {
      case 1:
        let value = cache[d.key];
        ipc.server.emit(socket, 'app.message',
          {
            id: ipc.config.id,
            message: value + ' from world!'
          });
        break;
      case 2:
        cache[d.key] = d.value;
        ipc.server.emit(socket, 'app.message',
          {
            id: ipc.config.id,
            message: d.value + 'push done from world!'
          });
        break;
      case 3:
        delete cache[d.key];
        ipc.server.emit(socket, 'app.message',
          {
            id: ipc.config.id,
            message: d.key + 'delete done from world!'
          });
        break;
    }

  });

});


ipc.server.start();