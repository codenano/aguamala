'use strict';

var thread = require('./thread');
var _ = require('underscore');
var mail = require('./mail');
var wss = require('ws').Server;
var session = {
  app:null
};
exports.start = function(app, server, callback){
    exports.room = new wss({server: server});
    exports.thread = thread;
    exports.server = server;
    exports.clients = [];
    thread.getRooms(function(err, rooms){
      if (err)
         console.log(err)
      else
        {
        exports.rooms = rooms;
        _.map(exports.rooms, function(value, key){
            exports.rooms[key].clients = [];
        });
        exports.room.on('connection', function(ws) {
          //process.memoryUsage()
          //console.log((0/0+"").repeat("7")+ " BatMan!");	
          console.log('++');
          ws.on('close', function() {
               _.map(exports.rooms, function(value, key){
                   exports.rooms[key].clients = _.reject(exports.rooms[key].clients, function(client){
                     return (client == ws)
                     });
               });   
             console.log('--');
             });
          ws.on('message', function(data){
       	     var data = JSON.parse(data);
       	     switch (data.type) {
       	      case 'meat':
                 console.log(data.msg+':'+data.fingerprint+'@'+data.room);
       	         if (thread.db)
       	            thread.setMsg(data);
                 _.map(exports.rooms, function(value, key){
                     if (exports.rooms[key].name == data.room)
       	                _.each(exports.rooms[key].clients, function(client){
       	                       client.send(JSON.stringify(data));
       	                      });
                 });
       	      break;
       	      case 'join':
                 console.log(data.room);
                 _.map(exports.rooms, function(value, key){
                     if (exports.rooms[key].name == data.room)
                        exports.rooms[key].clients.push(ws);
                 });              
       	      break;
       	      case 'leave':
                 _.map(exports.rooms, function(value, key){
                     exports.rooms[key].clients = _.reject(exports.rooms[key].clients, function(client){
                       return (client == ws)
                       });
                 });   
                 console.log('--');             
       	      break;       	      
       	      case 'start':
       	         session.app = data.app;
       	         switch(data.app){
       	           case 'aguamala':
       	              switch(data.module){
       	                case 'meat':
                           console.log(data.section+'hey joe');
       	                break;
       	                }
                       var menu = 
                          [
                           {
                             name:'Nosotros',
                             url:'/aguamala'
                           }, 
                           {
                             name: 'Inscríbete',
                             url:'/signup'
                           }, 
                           {
                             name: 'Iniciar Sesión',
                             url:'/signin'
                           }, 
                           {
                             name: 'Contacto',
                             url:'/meat/contacto'
                           }, 
                           {
                             name: 'Social',
                             url:'/meat/social'
                           }
                          ];
       	           break;        	        
       	           }
       	         var log = {
       	         	    type: 'start',
       	         	    app: data.app,
       	         	    menu: menu
       	         	    };
       	        ws.send(JSON.stringify(log));  
       	      break;
       	      case 'sendMail':
       	         mail.send(data.client, data.msg);
       	      break
       	      case 'signUp':
       	         if (thread.db)
       	            thread.signUp(data, function(err){
       	               if (err)
       	                  console.log(err);
       	               else {
       	                   _.each(exports.clients, function(client){
       	         	           client.send(JSON.stringify(data));
       	                   });       	      
       	                   var log = {
       	                   	    type: 'sign_up',
       	                   	    response: 'up '+data.email+'&'+data.pw
       	                   	    };
       	                   ws.send(JSON.stringify(log)); 
       	                   mail.send(data.email, data.pw);
       	                   }
       	               });
       	      break;
       	      case 'ping':
       	         var log = {
       	         	    app: data.app,
       	         	    type: 'pong'
       	         	    };
       	         //console.log('ping');
       	        ws.send(JSON.stringify(log));
       	      break;
       	      case 'signIn':
       	         var log = {
       	         	    type: 'sign_in',
       	         	    response: 'in '+data.email+'&'+data.password
       	         	    };
       	         ws.send(JSON.stringify(log));       	     
       	      break;         	   
       	      }   
             });
       exports.clients.push(ws);
       });
       }
    });    
    callback();
};

exports.startSession = function(req, res) {
     var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
     req.session.ip = ip;
     console.log(req.session.ip);
     res.render('app');
};