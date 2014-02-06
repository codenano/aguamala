module.exports = function(app, configurations, express) {
  //Module dependencies.
  var clientSessions = require('client-sessions');
  var nconf = require('nconf');
  var maxAge = 24 * 60 * 60 * 1000 * 28; //4 weeks
  var csrf = express.csrf();
  var logger = express.logger();
  //local conf 
  nconf.argv().env().file({ file: 'local.json' });
  //CSRF
  var clientBypassCSRF = function (req, res, next) {
    if (req.body.apiKey) {
      next();
    } else {
      csrf(req, res, next);
    }
  };
var conditionalLogger = function (req, res, next) {
  if (!(/\.(png|jpg|gif|jpeg|js|jade|html)$/i).test(req.path)) {
    logger(req, res, next);
  } else {
    next();
  }
};  
  //configure
  app.configure(function () {
    //views
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: false });
    //uses
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(conditionalLogger);
    app.use(express.static(__dirname + '/public'));
    app.use(clientSessions({
      cookieName: nconf.get('session_cookie'),
      secret: nconf.get('session_secret'),
      duration: maxAge, 
      cookie: {
        httpOnly: true,
        maxAge: maxAge
        }
      }));
      
    app.use(clientBypassCSRF);
    app.use(function (req, res, next) {
      res.locals.session = req.session;
      if (!req.body.apiKey) {
        res.locals.csrf = req.csrfToken();
      } else {
        res.locals.csrf = false;
      }
      if (!process.env.NODE_ENV) {
        res.locals.debug = true;
      } else {
        res.locals.debug = false;
      }
      res.locals.analytics = nconf.get('analytics');
      res.locals.appId = nconf.get('appId');
      res.locals.analyticsHost = nconf.get('analyticsHost');
      next();
    });
    app.enable('trust proxy');
    app.locals.pretty = true;
    app.locals.compileDebug = false;
    app.use(app.router);
    app.use(function (req, res, next) {
      res.status(404);
      res.render('404', { url: req.url, layout: false });
      return;
    });
    app.use(function (req, res, next) {
      res.status(403);
      res.render('403', { url: req.url, layout: false });
      return;
    });
  });
  //Configure with development params
/*  app.configure('development, test', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });*/
  //Configure production
  app.configure('prod', function() {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('500', { error: err, layout: false });
    });
    app.use(express.errorHandler());
  });
  return app;
  };
