'use strict';
module.exports = function(app, express, RedisStore, clientRedis, sessionStore) {

var nconf = require('nconf');
var thread = require('./thread');
var _ = require('underscore');
var mail = require('./mail');
var wss = require('ws').Server;


var clientsWS = [];

nconf.argv().env().file({ file: 'local.json' });

var cookieParser = express.cookieParser(nconf.get('session_secret'));

exports.isLoggedIn = function(req, res, next){
 if (!req.session.uname) {
    req.session.uname = "alien";
    }
 next();
};

exports.start = function(app, server, callback){
  exports.room = new wss({server: server});
  exports.thread = thread;
  exports.server = server;
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
          //console.log((0/0+"").repeat("7")+ "!");	
          ws.on('close', function() {
              _.map(exports.rooms, function(value, key){
                  exports.rooms[key].clients = _.reject(exports.rooms[key].clients, function(client){
                    return (client == ws)
                    });
                 });
              clientsWS = _.reject(clientsWS, function(client){
                    return (client == ws)
                    });   
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
                cookieParser(ws.upgradeReq, null, function(err) {
                  var sessionID = ws.upgradeReq.signedCookies['connect.sid'];
                  sessionStore.get(sessionID, function(err, sess) {
                   switch(sess.uname) {
                     case 'alien':
                       var menu = 
                             [
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
                     default:
                       var menu = 
                             [
                              {
                                name:'Contactos',
                                url:'/module/contact/section/main'
                              },
                              {
                                name:'Perfil',
                                url:'/module/profile/section/main'
                              }                                         
                             ];                                 
                     break;  
                     }
                    var log = {
                      type: 'start',
                      app: data.app,
                      menu: menu,
                      uname: sess.uname
                      };   
                    ws.send(JSON.stringify(log));                              
                  });                          
                });
              break;
              case 'sendMail':
                mail.send(data.client, data.msg);
              break;
              case 'signOut':
                var log = {
                   type: 'sign_out',
                   uname: data.uname
                   };
                console.log(log);
                _.each(clientsWS, function(client){
                    client.send(JSON.stringify(log));
                    });                
              break;
              case 'signUp':
                thread.signUp(data, function(err, res){
                if (err) {
                   var log = {
                   type: 'sign_up_fail',
                   response: err
                   };
                   ws.send(JSON.stringify(log));
                   }
                   else 
                      {
                      cookieParser(ws.upgradeReq, null, function(err) {
                         var sessionID = ws.upgradeReq.signedCookies['connect.sid'];
                         sessionStore.get(sessionID, function(err, sess) {
                                  sess.uname = data.email;
                                  sessionStore.set(sessionID, sess, function(err, sess) {
                                    var log = {
                                      type: 'sign_up_ok',
                                      response: data.email
                                      };
                                    ws.send(JSON.stringify(log));
                                    mail.send(data.email, data.pw);                                 
                                  });                                
                                });
                             });
                      }
                    });
              break;
              case 'ping':
                var log = {
                  app: data.app,
                  type: 'pong'
                  };
                ws.send(JSON.stringify(log));
              break;
              case 'signIn':
                thread.signIn(data, function(err, user){
                if (err)
                   {
                   var log = {
                       type: 'sign_in_fail',
                       response: 'error'
                       };
                   ws.send(JSON.stringify(log));
                   console.log(err);
                   }
                   else
                      {
                      if (user) {   
                          cookieParser(ws.upgradeReq, null, function(err) {
                            var sessionID = ws.upgradeReq.signedCookies['connect.sid'];
                            console.log(sessionID);
                            sessionStore.get(sessionID, function(err, sess) {
                              sess.uname = user.uname;
                              sessionStore.set(sessionID, sess, function(err, sess) {
                                console.log(sess);
                                var log = {
                                    type: 'sign_in_ok',
                                    response: user.uname
                                    };
                                ws.send(JSON.stringify(log));
                              });                                
                            });                              
                          });
                          }
                          else
                             {
                             var log = {
                                 type: 'sign_in_fail',
                                 response: 'Datos incorrectos'
                                 };
                             ws.send(JSON.stringify(log));
                             }
                      }
                  });
              break;
              }   
             });
       clientsWS.push(ws);       
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

return exports;
};