'use strict';

var thread = require('./thread');
var _ = require('underscore');
var mail = require('./mail');

process.on ("message", function (o, thread){
    if (o.port){
        console.log(o.port+':'+process.pid);
        noom(o, function(room){
           //process.send(room)
           //conso le.log(room)
           });
    }
    else if (o=='SIGUSR2') {
    console.log('ROOM About to exit.------------------------------------------------------'+process.pid);
    process.kill(process.pid);
    }
});
function noom(room, callback){
  var wss = require('ws').Server;
  //console.log('hr');
  var jroom = {
  	  room: new wss({port: room.port}),
      port: room.port,
      clients: []
      };
  jroom.room.on('connection', function(ws) {
       //process.memoryUsage()
       console.log('++:'+room.name);
       ws.on('close', function() {
       	  jroom.clients = _.reject(jroom.clients, function(client){
       	  	 return (client == ws)
       	     });
          console.log('--:'+room.name);
          });
       ws.on('message', function(data){
       	  var data = JSON.parse(data);
       	  switch (data.type) {
       	   case 'meat':
              console.log(data.msg+':'+data.fingerprint+'@'+data.room);
       	      if (thread.db)
       	         thread.setMsg(data);
       	         _.each(jroom.clients, function(client){
       	      	     client.send(JSON.stringify(data));
       	         });
       	   break; 
       	   case 'start':
       	      switch(data.module){
       	        case 'aguamala':
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
       	         thread.signUp(data);
       	         _.each(jroom.clients, function(client){
       	      	     client.send(JSON.stringify(data));
       	         });       	      
       	      var log = {
       	      	    type: 'sign_up',
       	      	    response: 'up '+data.email+'&'+data.pw
       	      	    };
       	      ws.send(JSON.stringify(log)); 
       	      mail.send(data.email, data.pw);
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
       jroom.clients.push(ws);
       });
  callback(jroom);
};