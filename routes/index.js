'use strict';

module.exports = function (app, nconf, rooms, thread, _) {
  //dependencies
  app.get('/', function (req, res) {
    res.render('app');
  });
  app.get('/signup', function (req, res) {
    res.render('app');
  });
  app.get('/signin', function (req, res) {
    res.render('app');
  });
  app.get('/aguamala', function (req, res) {
    res.render('app');
  });    
  app.get('/module/:module/section/:section', function (req, res) {
       res.render('app');
  });  
  app.get('/meat/:id', function (req, res) {
       res.render('app');
  });
  app.get('/ip', function (req, res) {
    res.json({
      ip: req.ip
    });
  });
  //api
  app.get('/api/rooms', function (req, res) {
    res.json({
      rooms: rooms
    });
  });
  app.get('/api/data/dellitours', function (req, res) {
    var menu = ['Paquetes', 'Excursiones', 'Hoteles', 'Transporte', 'Nosotros'];
    res.json({
      menu: menu
    });
  });  
  app.get('/api/signos/:room', function (req, res) {
  	if (thread.db)
    thread.getThread(req, function(err, threads){
    	if (err) {
    	  res.status(400);
        res.json({
          message: err.toString()
        });
    	  } else {
           res.json({
                threads: threads
              });
          }
       });
    else
      res.json({
      	threads: []
      });
  });
};

