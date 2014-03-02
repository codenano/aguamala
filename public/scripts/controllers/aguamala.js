'use strict';
angular.module('h2o.aguamala', []).
  controller('aguamala', function ($rootScope, $scope, $location, $http, $routeParams){
    $scope.app = document.getElementById('app');
    $scope.load = document.getElementById('load');
    $scope.load.style.display = 'block';
    $scope.app.style.display = 'none'; 
    $scope.validateEmail = function(email, callback) { 
       var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       callback(re.test(email));
       };
    $scope.validatePssw = function(pssw, callback) { 
       callback((pssw.length >= 8));
       };       
    $scope.initUser = function(){
       //$rootScope.loadMenu();
       console.log('fkdy');
       };
    $scope.initAlien = function(){
       $rootScope.loadMenu();
       $scope.load.style.display = 'none';
       $scope.app.style.display = 'block';
       console.log('here');
       switch($location.path()) {
                     case '/signup':     
                        $scope.user_signup_action = function(){
                         	 var user_data = {
                         		  email: $scope.user_email.value,
                         		  pw: $scope.pw.value,
                         		  type: 'signUp'
                         	    };
                           $rootScope.socket.send(JSON.stringify(user_data)); 
                           };
                        $scope.signUp = function() {
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
                       setTimeout(function(){
                         document.getElementById('singin_email').focus();
                         },500);
                       $scope.singin_email_v = false;
                       $scope.singin_pssw_v = false;
                       $scope.signIn = function() {
                         	var user_data = {
                         		  email: $scope.singin_email.value,
                         		  pw: $scope.singin_pssw.value,
                         		  type: 'signIn'
                         	    };
                          $rootScope.socket.send(JSON.stringify(user_data));                           
                          };
                       $scope.keyMail = function() {
                           $scope.singin_email_v = false;
                           $scope.singin_email = document.getElementById('singin_email');
                           $scope.user_signin = document.getElementById('user_signin');
                           $scope.validateEmail($scope.singin_email.value.toString(), function(res){
                             if (res) 
                                {
                                $scope.singin_email.parentNode.childNodes[1].innerHTML = 'Email valido';
                                $scope.singin_email.parentNode.className = 'form-group has-success';
                                $scope.singin_email_v = true;
                                }
                                else
                                   {
                                   $scope.singin_email.parentNode.childNodes[1].innerHTML = 'Email no valido';
                                   $scope.singin_email.parentNode.className = 'form-group has-error';
                                   }
                             if ($scope.singin_pssw_v && $scope.singin_email_v)
                                {
                                $scope.user_signin.disabled = false;
                                }
                                else
                                   {
                                   $scope.user_signin.disabled = true;
                                   }
                             });
                          };
                       $scope.keyPssw = function() {
                           $scope.singin_pssw_v = false;
                           $scope.singin_pssw = document.getElementById('singin_pssw');
                           $scope.user_signin = document.getElementById('user_signin');
                           $scope.validatePssw($scope.singin_pssw.value.toString(), function(res){
                             if (res) 
                                {
                                $scope.singin_pssw.parentNode.childNodes[1].innerHTML = 'Contraseña valida';
                                $scope.singin_pssw.parentNode.className = 'form-group has-success';
                                $scope.singin_pssw_v = true;
                                }
                                else
                                   {
                                   $scope.singin_pssw.parentNode.childNodes[1].innerHTML = 'Contraseña no valida';
                                   $scope.singin_pssw.parentNode.className = 'form-group has-error';
                                   }
                             if ($scope.singin_pssw_v && $scope.singin_email_v)
                                {
                                console.log('ready');
                                $scope.user_signin.disabled = false;
                                }
                                else
                                   {
                                   console.log('notready'); 
                                   $scope.user_signin.disabled = true;
                                   }                                  
                             });
                          };                          
                     break;
                     case '/meat':
                       console.log('meat');
                     break;                     
                     default: 
                       //console.log($location.path());
                     break;
                     }        
      };
    //console.log($rootScope.uname); 
     var intervalLoad = setInterval(function(){
       console.log($rootScope.state+'c');
       if ($rootScope.state == 'start') {
          if (($rootScope.uname == 'alien') || ($location.path()=='/'))  
             $scope.initAlien();
          else 
             $rootScope.$apply(function(){
               $location.path("/");
             });         
          clearInterval(intervalLoad);
          }
       },100);   
    });