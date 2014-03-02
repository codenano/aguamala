'use strict';
angular.module('h2o.app', []).
  controller('app', function ($rootScope, $scope, $location, $http, $routeParams){
     $scope.module = $routeParams.module;
     $scope.section = $routeParams.section;
     console.log($scope.module+$scope.module);
     $scope.app = document.getElementById('app');
     $scope.load = document.getElementById('load');
     $scope.load.style.display = 'block';
     $scope.app.style.display = 'none'; 
     $scope.init = function(){
        $rootScope.loadMenu();
        $scope.load.style.display = 'none';
        $scope.app.style.display = 'block';   
        };
     $scope.intervalLoad = setInterval(function(){
       console.log($rootScope.state);
       if ($rootScope.state == 'start') {
          if ($rootScope.uname == 'alien')   
             $rootScope.$apply(function(){
               $location.path("/");
             });
          else 
             $rootScope.$apply(function(){
               //$location.path("/");
               $scope.init();
             }); 
          clearInterval($scope.intervalLoad);   
          }
       },100);     
  });