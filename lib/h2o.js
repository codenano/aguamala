'use strict';
module.exports = function(app, express, sessionStore) {

var nconf = require('nconf');
var thread = require('./thread');
var _ = require('underscore');
var mail = require('./mail');
var wss = require('ws').Server;

var clientsWS = [];
var roomsNS = [];
var roomsWS = [];

nconf.argv().env().file({ file: 'local.json' });

var cookieParser = express.cookieParser(nconf.get('session_secret'));

exports.isLoggedIn = function(req, res, next){
 if (!req.session.uname) {
    req.session.uname = 'alien';
    }
 next();
};

exports.start = function(app, server, callback){
  exports.room = new wss({server: server});
  exports.thread = thread;
  exports.server = server;
  if (exports.thread.db)
     thread.twt(function(data){
       var murls = [];
       if (data.entities.media)
         _.each(data.entities.media, function(m){
            murls.push(m.media_url);
           });
       var res = {
         murls: murls,
         profile_pic: data.user.profile_image_url,
         user: data.user.screen_name,
         msg: data.text
       };
       var log = {
         response: res,
         type: 'twt_up'
       };
       _.each(clientsWS, function(client){
             client.send(JSON.stringify(log));
             });
     });
  exports.room.on('connection', function(ws) {
    //process.memoryUsage()
    //console.log((0/0+"").repeat("7")+ "!");
    ws.on('close', function() {
        _.map(roomsNS, function(key, value){
          roomsWS[key] = _.reject(roomsWS, function(client){
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
           _.each(roomsWS[data.room], function(client){
                client.send(JSON.stringify(data));
              });
        break;
        case 'freebase_description':
          var query = data.query;
          thread.freebaseDescription(data, function(res){
              var log = {
                type: 'freebase_description',
                query: query,
                response: res
                };
              if (ws.upgradeReq.client.writable)
                 ws.send(JSON.stringify(log));
            });
        break;
        case 'join':
            if (!(_.find(roomsNS, function(room){return room === data.room}))) {
               roomsNS.push(data.room);
               roomsWS[data.room] = [];
               }
            roomsWS[data.room].push(ws);
        break;
        case 'leave':
            roomsWS[data.room] = _.reject(roomsWS[data.room], function(client){
              return (client === ws)
              });
            if (roomsWS[data.room].length === 0)
               roomsNS = _.reject(roomsNS, function(room){
                 return (room === data.room)
                 });
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
                          icon: 'user',
                          url:'/signup'
                        },
                        {
                          name: 'Iniciar Sesión',
                          icon: 'hand-o-right',
                          url:'/signin'
                        },
                        {
                          name: 'Contacto',
                          icon: 'comments-o',
                          url:'/meat/contacto'
                        },
                        {
                          name: 'Social',
                          icon: 'users',
                          url:'/meat/social'
                        }
                       ];
               break;
               default:
                 var menu =
                       [
                        {
                          name:'Contactos',
                          icon: 'users',
                          url:'/module/contact/section/main'
                        },
                        {
                          name:'Perfil',
                          icon: 'user',
                          url:'/module/profile/section/main'
                        }
                       ];
               break;
               }
              var log = {
                type: 'start',
                app: data.app,
                menu: menu,
                uname: sess.uname,
                sid: sessionID
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
                                response: data.email,
                                sid: sessionID
                                };
                              _.each(clientsWS, function(client){
                                  client.send(JSON.stringify(log));
                                  });
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
                              response: user.uname,
                              sid: sessionID
                              };
                          _.each(clientsWS, function(client){
                              client.send(JSON.stringify(log));
                              });
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