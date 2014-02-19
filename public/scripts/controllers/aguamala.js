'use strict';
angular.module('h2o.aguamala', []).
  controller('aguamala', function ($rootScope, $scope, $location, $http, $routeParams){
    $scope.init = function(){
       switch($location.path()) {
                     case '/signup':     
                        //$scope.user_email.focus();
                        $scope.user_signup_action = function(){
                         	 var user_data = {
                         		  email: $scope.user_email.value,
                         		  pw: $scope.pw.value,
                         		  type: 'signUp'
                         	    };
                           $rootScope.socket.send(JSON.stringify(user_data)); 
                           };
                        $scope.signUp = function() {
                           $scope.user_signup = document.getElementById('user_signup');
                           $scope.user_email = document.getElementById('user_email');
                           $scope.pw = document.getElementById('psw');
                           if (($scope.pw.value.length < 8)||(($scope.user_email.value.length < 6)||($scope.user_email.value=='')||($scope.user_email.value==null)))
                              {
                              var dl = document.getElementById('modalDialogLabel');
                              var dlb = document.getElementById('modalDialogBody');
                              dl.innerHTML = 'Llenar ambos datos';
                              dlb.innerHTML = 'Para registrarte debes llenar tanto el campo de contaseña como el de email, con datos validos, la <b>contraseña</b> debe tener minimo <b>8 caracteres</b>, y el mail el formato de mail (usuario@dominio)';
                              $('#modalDialog').on('hidden.bs.modal', function () {
                                if ($scope.pw.value.length < 8)
                                   {
                                    $scope.pw.focus();   
                                   }                                 
                              });
                              $('#modalDialog').modal('show');
                              }
                              else
                                 {
                                 $scope.user_signup_action();
                                 }
                           }; 
                     break;
                     case '/signin':
                        $('#modalDialog').modal('show');
                     break;
                     case '/meat':
                       
                     break;                     
                     default: 
                       //console.log($location.path());
                     break;
                     }        
      };
    $scope.init();
    });