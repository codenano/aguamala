'use strict';

var nconf = require('nconf');
nconf.argv().env().file({ file: 'local.json' });
var appPort = nconf.get('port');

var express = require('express');
var configurations = module.exports;
var app = express();
var server = require('http').createServer(app);
var settings = require('./settings')(app, configurations, express);
var h2o = require('./lib/h2o');

h2o.start(app, server, function(){
    require('./routes')(app, h2o);
    server.listen(appPort);
  });