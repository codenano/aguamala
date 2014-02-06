'use strict';

var fs = require('fs');


var nconf = require('nconf');

nconf.argv().env().file({ file: 'local.json' });

var aPort = nconf.get('socket');

exports.stream = function(dir, callback){
    fs.readdir(dir, function(err, files){
       var res = new Array();
       for(var i in files){
          var name = dir+files[i];
          var name_file = name.split('/')[4].split('.')[0];
          var type = 'meat';
          if (name_file.split('_')[1])
             {
             type = name_file.split('_')[0];
             name_file = name_file.split('_')[1];
             }
          res.push({
            	"file": name,
            	"name": name_file,
            	"type": type,
            	"port": aPort
            	});
          aPort++;
          }
       console.log(res);
       callback(res);
       });
};
