'use strict';

angular.module('h2o', [
  'ngRoute',
  'h2o.factories',
  'h2o.controllers',
  'h2o.directives'
]).
run(function ($rootScope, $http, $location) {
 $rootScope.app = 'h2o';
}).
config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      controller: 'aguamala',
      templateUrl: 'partials/app.html'
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
      templateUrl: 'partials/app.html'
    })    
    .when('/module/:module/section/:section', {
      controller: 'appCtrl',
      templateUrl: 'partials/app.html'
    })    
    .when('/meat/:id', {
      controller: 'meatCtrl',
      templateUrl: 'partials/meat.html'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
});