'use strict';
angular.module('h2o.aguamala', []).
  controller('aguamala', function ($rootScope, $scope, $location, $http, $routeParams, transformer){
    $scope.load = document.getElementById('loadCont');
    $scope.validateEmail = function(email, callback) {
       var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       callback(re.test(email));
       };
    $scope.validatePssw = function(pssw, callback) {
       callback((pssw.length >= 8));
       };
    $scope.validateFreebase = function(freebase, callback) {
       callback((freebase.length >= 2));
       };
    $scope.initAlien = function(){
       $rootScope.start = false;
       $rootScope.loading();
       $('.panel').css({ transform: 'rotate(0deg)'});
       switch($location.path()) {
                     case '/signup':
                       document.getElementById('singup_email').focus();
                       $scope.singup_email_v = false;
                       $scope.singup_pssw_v = false;
                       $scope.signUp = function() {
                          var user_data = {
                              email: $scope.singup_email.value,
                              pw: $scope.singup_pssw.value,
                              type: 'signUp'
                              };
                          $rootScope.loading();
                          $rootScope.socket.send(JSON.stringify(user_data));
                          };
                       $scope.keyMail = function() {
                           $scope.singup_email_v = false;
                           $scope.singup_email = document.getElementById('singup_email');
                           $scope.user_signup = document.getElementById('user_signup');
                           $scope.validateEmail($scope.singup_email.value.toString(), function(res){
                             if (res)
                                {
                                $scope.singup_email.parentNode.childNodes[1].innerHTML = 'Email valido';
                                $scope.singup_email.parentNode.className = 'form-group has-success';
                                $scope.singup_email_v = true;
                                }
                                else
                                   {
                                   $scope.singup_email.parentNode.childNodes[1].innerHTML = 'Email no valido';
                                   $scope.singup_email.parentNode.className = 'form-group has-error';
                                   }
                             if ($scope.singup_pssw_v && $scope.singup_email_v)
                                {
                                $scope.user_signup.disabled = false;
                                }
                                else
                                   {
                                   $scope.user_signup.disabled = true;
                                   }
                             });
                          };
                       $scope.keyPssw = function() {
                           $scope.singup_pssw_v = false;
                           $scope.singup_pssw = document.getElementById('singup_pssw');
                           $scope.user_signup = document.getElementById('user_signup');
                           $scope.validatePssw($scope.singup_pssw.value.toString(), function(res){
                             if (res)
                                {
                                $scope.singup_pssw.parentNode.childNodes[1].innerHTML = 'Contraseña valida';
                                $scope.singup_pssw.parentNode.className = 'form-group has-success';
                                $scope.singup_pssw_v = true;
                                }
                                else
                                   {
                                   $scope.singup_pssw.parentNode.childNodes[1].innerHTML = 'Contraseña no valida';
                                   $scope.singup_pssw.parentNode.className = 'form-group has-error';
                                   }
                             if ($scope.singup_pssw_v && $scope.singup_email_v)
                                {
                                $scope.user_signup.disabled = false;
                                }
                                else
                                   {
                                   $scope.user_signup.disabled = true;
                                   }
                             });
                          };
                     break;
                     case '/signin':
                       document.getElementById('singin_email').focus();
                       $scope.singin_email_v = false;
                       $scope.singin_pssw_v = false;
                       $scope.signIn = function() {
                          var user_data = {
                            email: $scope.singin_email.value,
                            pw: $scope.singin_pssw.value,
                            type: 'signIn'
                            };
                          $rootScope.loading();
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
                                $scope.user_signin.disabled = false;
                                }
                                else
                                   {
                                   $scope.user_signin.disabled = true;
                                   }
                             });
                          };
                     break;
                     case '/':
                      $rootScope.canvas = document.getElementById('canvasSample');
                      if ( ! $scope.canvas || ! $scope.canvas.getContext ) { return false; }
                      $rootScope.ctx = $rootScope.canvas.getContext('2d');
                      $rootScope.imgx = new Image();
                      $rootScope.imgx.src = '/images/aguamala/aguamala-300.png';
                      $scope.initPuyo = function() {
                        $scope.mouseX = 0;
                        $scope.mouseY = 0;
                        $rootScope.puyoDotInt = setInterval(function() {
                          $rootScope.puyoDot.frame($scope.mouseX, $scope.mouseY);
                        }, 30);
                        $scope.$on('$routeChangeStart', function(event, current, previous, rejection) {
                         clearInterval($rootScope.puyoDotInt);
                        });
                      };
                      $scope.f = document.getElementById('foo');
                       $('#canvasSample').mousedown(function(e) {
                        $scope.mouseX = e.pageX;
                        $scope.mouseY = e.pageY;
                        $scope.f.style.left = $scope.mouseX+'px';
                        $scope.f.style.top = $scope.mouseY+'px';
                        $rootScope.puyoDot.startBornDrag($scope.mouseX, $scope.mouseY);
                       });
                      $('#canvasSample').mouseup(function(e) {
                        $rootScope.puyoDot.endBornDrag();
                      });
                      $('#canvasSample').mousemove(function(e) {
                        $scope.mouseX = e.pageX + 8;
                        $scope.mouseY = e.pageY + 8;
                        //$scope.ctx.fillRect ($scope.mouseX, $scope.mouseY, 20,20);
                      });
                      if (!$rootScope.firstLoad) {
                        $rootScope.firstLoad = true;
                        $rootScope.puyoDot = new PuyoDot(window.innerWidth, window.innerHeight);
                        $rootScope.puyoDot.init(transformer.MapSlime(), transformer.drawParticles);
                        $scope.initPuyo();
                        }
                        else
                           {
                            $scope.initPuyo();
                           }
                      $scope.resizeCanvas = function() {
                          $rootScope.canvas.width = window.innerWidth;
                          $rootScope.canvas.height = window.innerHeight;
                      };
                      window.addEventListener('resize', $scope.resizeCanvas, false);
                      $scope.resizeCanvas();
                      console.log(window.innerWidth);
                      /* bounceIn, bounceInUp, bounceInDown, bounceInLeft,
                      bounceInRight, rotateIn, rotateInUpLeft, rotateInDownLeft,
                      rotateInUpRight, rotateInDownRight  */
                      $scope.bgColor;
                      $scope.effect = 'animated bounceInLeft';
                      $('.content li').click(function(){
                        $('.card-front, .card-back').css('display', 'none');
                        $('.content li').removeClass('activebox').css('display', 'none');
                        $(this).addClass('activebox').css('display', 'block');
                        $scope.bgColor = $('.activebox .card-back').css('background-color');
                        $('.content').css('background-color',$scope.bgColor);
                        $('.close, .all-content').css('display', 'block');
                        $('.content').append('<span class="close">close</span>').addClass($scope.effect);
                      });
                      $('.content').on('click', '.close', function(){
                        $('.close').remove();
                        $scope.bgColor = $('.activebox .card-front').css('background-color');
                        $('.content').removeClass($scope.effect);
                        $('.all-content').css('display', 'none');
                        $('.content li').removeClass('activebox').css('display', 'block');
                        $('.card-front, .card-back').css('display', 'block');
                        $('.content').css('background-color',$scope.bgColor);
                      });
                       document.getElementById('freebaseInput').focus();
                       $scope.keyFreebase = function() {
                           $scope.singin_pssw_v = false;
                           $scope.singin_pssw = document.getElementById('freebaseInput');
                           $scope.user_signin = document.getElementById('freebaseSearch');
                           $scope.validateFreebase($scope.singin_pssw.value.toString(), function(res){
                             if (res)
                                {
                                $scope.singin_pssw.parentNode.childNodes[1].innerHTML = 'Termino valido';
                                $scope.singin_pssw.parentNode.className = 'form-group has-success';
                                $scope.user_signin.disabled = false;
                                }
                                else
                                   {
                                   $scope.singin_pssw.parentNode.childNodes[1].innerHTML = '';
                                   $scope.singin_pssw.parentNode.className = 'form-group';
                                   $scope.user_signin.disabled = true;
                                   }
                             });
                          };
                       $scope.freebase = function(){
                          $scope.freebaseInput = document.getElementById('freebaseInput');
                          var data = {
                            query: $scope.freebaseInput.value,
                            type: 'freebase_description'
                            };
                          $scope.loadFreebase = document.getElementById('loadFreebase');
                          $scope.freebaseInput.value = '';
                          $rootScope.loading();
                          $rootScope.socket.send(JSON.stringify(data));
                       };

                     break;
                     default:
                       console.log($location.path());
                     break;
                     }
      };
     $scope.intervalLoad = setInterval(function(){
       if (($rootScope.state === 'start')&&($rootScope.included === 'start')) {
          clearInterval($scope.intervalLoad);
          if (($rootScope.uname === 'alien')||($location.path()=='/'))
             $scope.initAlien();
          else
             $rootScope.$apply(function(){
               $location.path("/");
             });
          }
       },100);
    });