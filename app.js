'use strict';
//Module dependencies
var express = require('express');
var configurations = module.exports;
var app = express();
var server = require('http').createServer(app);
var nconf = require('nconf');
var settings = require('./settings')(app, configurations, express);
var _ = require('underscore');
nconf.argv().env().file({ file: 'local.json' }); //read local config
//Websocket
var rooms = require('./lib/rooms');
var wsrooms = [];
process.once('SIGUSR2', function () {
	//console.log('About to exit.------------------------------------------------------'+process.pid);
  _.each(wsrooms, function(room){
    	 	room.send('SIGUSR2');
       });
  setTimeout(process.kill(process.pid, 'SIGUSR2'), 300);
});

//Db settings
//mail.send();
var thread = require('./lib/thread');
rooms.stream(nconf.get('itemlocation'), function(rooms){
     _.map(rooms, function(room, key){
    	 	 wsrooms.push(require('child_process').fork('./lib/noom.js'));
         wsrooms[key].send(room);
         wsrooms[key].unref();
       });
    require('./routes')(app, nconf, rooms, thread, _);
    server.listen(process.env.PORT || nconf.get('port'));
  });