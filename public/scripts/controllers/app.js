'use strict';
angular.module('h2o.app', []).
  controller('app', function ($rootScope, $scope, $location, $http, $routeParams){
     $scope.module = $routeParams.module;
     $scope.section = $routeParams.section;
     $rootScope.start = false;
     $rootScope.firstLoad = false;
     $rootScope.loading();
     $scope.init = function(){
        console.log('load start:'+$scope.module);
        $('.panel').css({ transform: 'rotate(0deg)'});
        };
     $scope.intervalLoad = setInterval(function(){
       if ($rootScope.state === 'start') {
          clearInterval($scope.intervalLoad);
          $scope.init();
          //$rootScope.loading();
          }
       },100);
  });