'use strict';
angular.module('h2o.app', []).
  controller('app', function ($rootScope, $scope, $location, $http, $routeParams){
     $scope.module = $routeParams.module;
     $scope.section = $routeParams.section;
     $scope.app = document.getElementById('app');
     $scope.load = document.getElementById('loadCont');
     $scope.load.style.display = 'block';
     $scope.app.style.display = 'none'; 
     $scope.init = function(){
        $rootScope.loadMenu();
        $scope.load.style.display = 'none';
        $scope.app.style.display = 'block';   
        };
     $scope.intervalLoad = setInterval(function(){
       if ($rootScope.state === 'start') {
          clearInterval($scope.intervalLoad);
          console.log($rootScope.uname);
          if ($rootScope.uname === 'alien')   
             $rootScope.$apply(function(){
               $location.path("/");
             });
          else 
             $scope.init(); 
          }
       },100);     
  });