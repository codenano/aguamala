'use strict';

var nconf = require('nconf');

nconf.argv().env().file({ file: 'local.json' });
exports.db = JSON.parse(nconf.get('db'));
var dbuser = nconf.get('dbuser'); 
var dbpass = nconf.get('dbpass');
var dbtype = nconf.get('dbtype');
var dbname = nconf.get('dbname');
if (exports.db)
   {
   var pg = require('pg'),
       conString = 'pg://'+dbuser+':'+dbpass+'@186.90.223.243:5432/aenima';
       
   exports.getThread = function (req, callback) {
   pg.connect(conString, function(err, client, done) {
     if(err)
       callback(err);
     var threads = [];
     client.query('SELECT * FROM signos WHERE room like $1 ORDER BY date DESC LIMIT 20', [req.route.params.room], function(err, result)        {
     	 done();
       if(err)
         callback(err);
       if (result.rows.length)
          for (var i=0; i<result.rows.length; i++)
            threads.push({msg: result.rows[i].msg, pic: result.rows[i].pic.toString(), date: result.rows[i].date});
       callback(null, threads);
     });
   });
   };
   exports.setMsg = function (msg) {
   pg.connect(conString, function(err, client, done) {
     done();
     if(err) 
       callback(err);
     client.query('INSERT INTO signos (msg, pic, room) VALUES ($1, $2, $3)', [msg.msg, msg.pic, msg.room], function(err, result) {
       if(err) 
         console.log(err);
     });
   });
   };
   
   } 
   else
      {
      console.log('no thread mode (free socket)');//TODO ephemeral	
      }