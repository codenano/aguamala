'use strict';
/*
    501878200046345148
    console.log('%c dc ', 'background: #222; color: #bada55');
    git config remote.origin.url https://you:password@github.com/you/example.git
    git config core.fileMode false
    rails generate scaffold name attribute:type
    perl nombrearchivo.pl -dns www.pagina.com
    script(src='/scripts/lib/jquery/jquery.js')
    script(src='/scripts/lib/underscore/underscore-min.js')
    script(src='/scripts/lib/angular/angular.js')
    script(src='/scripts/lib/angular-route/angular-route.js')
    script(src='/scripts/lib/animated-gif/dist/Animated_GIF.min.js')
    script(src='/scripts/lib/fingerprint/fingerprint.min.js')
    script(src='/scripts/lib/gumhelper/gumhelper.js')
    script(src='/scripts/lib/jquery-waypoints/waypoints.js')
    script(src='/scripts/base/videoShooter/videoShooter.js')
    script(src='/scripts/lib/bootstrap-sass/dist/js/bootstrap.min.js')
*/
angular.module('h2o', [
  'ngRoute',
  'h2o.factories',
  'h2o.controllers',
  'h2o.directives'
]).
run(function ($rootScope, $http, $location) {
  $rootScope.state = 'loading';
  $rootScope.included = 'loading';
  var host = window.location.hostname;
  $rootScope.app = 'aguamala';
  $rootScope.socket = new WebSocket('ws://' + host);
}).
config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      controller: 'aguamala',
      templateUrl: 'partials/aguamala.html'
    })
    .when('/signup', {
      controller: 'aguamala',
      templateUrl: 'partials/signup.html'
    })
    .when('/aguamala', {
      controller: 'aguamala',
      templateUrl: 'partials/aguamala.html'
    })
    .when('/signin', {
      controller: 'aguamala',
      templateUrl: 'partials/signin.html'
    })
    .when('/module/slides/section/:section', {
      controller: 'slides',
      templateUrl: 'partials/slides.html'
    })
    .when('/module/dellitours/section/:section', {
      controller: 'dellitours',
      templateUrl: 'partials/dellitours.html'
    })
    .when('/module/sumito/section/:section', {
      controller: 'sumito',
      templateUrl: 'partials/sumito.html'
    })
    .when('/module/aguamala/section/:section', {
      controller: 'aguamala',
      templateUrl: 'partials/aguamala.html'
    })
    .when('/module/:module/section/:section', {
      controller: 'app',
      templateUrl: 'partials/app.html'
    })
    .when('/signout', {
      controller: 'app',
      templateUrl: 'partials/app.html'
    })
    .when('/meat/:id', {
      controller: 'meatchat',
      templateUrl: 'partials/meat.html'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
});