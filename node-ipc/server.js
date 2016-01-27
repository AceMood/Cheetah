/**
 * Created by baidu on 16/1/27.
 */

var ipc=require('node-ipc');

/***************************************\
 *
 * You should start both hello and world
 * then you will see them communicating.
 *
 * *************************************/

ipc.config.id = 'world';
ipc.config.appspace = 'soi.cache';
ipc.config.retry = 1500;
ipc.config.sync = true;

// Used to create local Unix Socket Server or Windows Socket Server to which Clients can bind.
// The server can emit events to specific Client Sockets, or broadcast events to all known Client Sockets.
ipc.serve(function() {
  ipc.server.on('app.message', function(data, socket) {
    //ipc.log('got a message from'.debug, (data.id).variable, (data.message).data);

    setTimeout(function() {
      ipc.server.emit(socket, 'app.message',
        {
          id: ipc.config.id,
          message: data.message + ' world!'
        });
    }, 2000);

  });

});


ipc.server.start();