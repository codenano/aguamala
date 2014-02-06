'use strict';
angular.module('h2o.controllers', []).
  controller('aguamala', function ($scope, $rootScope, $location, $http, $routeParams){
    $scope.module = 'aguamala';
    $scope.menuList = document.getElementById('menu_list');
      	$('.logoapp').on('click', function(){
  		  $scope.ws.close();
        $scope.$apply(function(){
        	$location.path("/");
        });
      	}); 
                              	
    $scope.init = function(){
    var host = window.document.location.host.replace(/:.*/, '');
    $scope.ws = new WebSocket('ws://' + host +':1338');
    $scope.ws.onmessage = function (event) {
    	  var data = JSON.parse(event.data);
    	  if ((data)&&(data.type)){
    	     switch(data.type) {
    	     	 case 'start':
                    while ($scope.menuList.firstChild) {
                      $scope.menuList.removeChild($scope.menuList.firstChild);
                      }
      	            _.each(data.menu, function(value){
                     var li = document.createElement('li');
                     var link = document.createElement('a');
                     if (value.url === $location.path())
                        li.className = 'active';                                
                     link.innerHTML = value.name.toUpperCase();
                     link.addEventListener('click', function(){
                         $scope.$apply(function(){
                           $scope.ws.close();
                           $location.path(value.url);
                         });                            	
                     	}, false);
                     li.appendChild(link);
                     $scope.menuList.appendChild(li);
                     });
                   switch($location.path()) {
                     case '/signup':                       
                        $scope.user_signup = document.getElementById('user_signup');
                        $scope.user_email = document.getElementById('user_email');
                        $scope.pw = document.getElementById('psw');
                        $scope.user_signup_action = function(){
                           console.log('rabbit in the hole');
                         	 var user_data = {
                         		  email: $scope.user_email.value,
                         		  pw: $scope.pw.value,
                         		  type: 'signUp'
                         	    };
                           $scope.ws.send(JSON.stringify(user_data)); 
                           };
                        $scope.signUp = function() {
                           console.log($scope.user_email.value+''+$scope.user_email.value.length);
                           if (($scope.pw.value.length < 8)||(($scope.user_email.value.length < 6)||($scope.user_email.value=='')||($scope.user_email.value==null)))
                              {
                              var dl = document.getElementById('modalDialogLabel');
                              dl.innerHTML = 'Eso no se hace...';
                              dl.style.color = '#000';
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
                        $scope.user_email.focus();
                     break;
                     case '/signin':
                        $('#modalDialog').modal('show');
                     break;
                     case '/blog':
                       
                     break;                     
                     default: 
                       console.log($location.path());
                     break;
                     }                     
    	          break;
    	        case 'sign_up':
    	              console.log(data.response); 
    	          break;        
    	        }  	  
          } 
        };
      $scope.ws.onopen = function (wss) {
    	  var log = {
    	  	  module: 'aguamala',
    	  	  section: 'main',
    	  	  type: 'start'
    	   };
        $scope.ws.send(JSON.stringify(log));
        };      
      };
    $scope.init();
    }).
  controller('meatCtrl', function ($scope, $rootScope, $location, $http, $routeParams, cameraHelper) {
    $scope.menuList = document.getElementById('menu_list');
    $scope.canSend = false;
    $scope.roomId = $routeParams.id;
    $scope.roomType = $routeParams.type;
    $scope.CHAR_LIMIT = 250;
      $(document).on('keydown', function (event) {
      if (event.keyCode === 27)
         if (($('.header').css('display'))==='block')
            $('').css('display', 'none')
         else
            $('.header').css('display', 'block')
      if (event.target !== $('#add-chat')[0]) {
         $('#add-chat').focus();
         }
    });
  	$('.logoapp').on('click', function(){
  		  $scope.resetForm();
  		  $scope.ws.close();
        $scope.$apply(function(){
        	$location.path("/");
        });
  		});    
    $scope.fingerprint = new Fingerprint({ canvas: true }).get();
    $http.get('/api/rooms').success(function(data) {
    	        for (var i=0;i<data.rooms.length;i++)
  		      	    if (data.rooms[i].name===$scope.roomId)
  		      	       break;
  		        $http.get('/api/signos/'+$scope.roomId).success(function(data) {
  		      	    $scope.parseThread(data, function(){
  		      	    	console.log('done');
  		      	    	setTimeout(function(){
  		      	    		  $scope.canSend = true;
  		      	    	    $('#add-chat').prop('readonly', false);
  		      	    	    $('#add-chat-blocker').addClass('hidden');
  		      	    	}, 300);
  		      	    });
  		  	        });
              var host = window.document.location.host.replace(/:.*/, '');
              $scope.ws = new WebSocket('ws://' + host +':'+ data.rooms[i].port.toString());
              $scope.ws.onmessage = function (event) {
              	  var data = JSON.parse(event.data);
              	  switch (data.type) {
              	    case 'start':
              	     while ($scope.menuList.firstChild) {
                      $scope.menuList.removeChild($scope.menuList.firstChild);
                      }
              	     _.each(data.menu, function(value){
                     var li = document.createElement('li');
                     var link = document.createElement('a');
                     //link.className = 'menu-item';  
                     if (value.url === $location.path())
                        li.className = 'active';                                
                     link.innerHTML = value.name.toUpperCase();
                     link.addEventListener('click', function(){
                         $scope.$apply(function(){
                           $scope.resetForm();
                           $scope.ws.close();
                           $location.path(value.url);
                         });                            	
                     	}, false);
                     li.appendChild(link);
                     $scope.menuList.appendChild(li);
                     });
              	    break;
              	    case 'meat':   
                     var chatList = document.getElementById('chatList');
                     var li = document.createElement('li');
                     var msg = document.createElement('p');
                     var pic = document.createElement('img');
                     msg.innerHTML = data.msg;
                     pic.src = data.pic;
                     li.appendChild(msg);
                     li.appendChild(pic);
                     chatList.appendChild(li);
                     $scope.setupWaypoints(li);
                    break;              	    
              	    }
                  };
              $scope.ws.onopen = function (wss) {
                  var log = {
    	  	          module: 'aguamala',
    	  	          section: 'main',
    	  	          type: 'start'
    	              };
                  $scope.ws.send(JSON.stringify(log));
              	  $('#add-chat').prop('readonly', true);
              	  $('#add-chat-blocker').removeClass('hidden');
              	  $scope.canSend =false;
                  };
  		  	    });
    $scope.resetForm = function () {
         $scope.errors = false;
         
         $scope.message = '';
         $scope.picture = '';
         $scope.showCamera = false;
         cameraHelper.resetStream();
       };  			  
    $scope.setupWaypoints = function (rawLi) {
      var li = $(rawLi);
      li.waypoint(function (direction) {
        li.toggleClass('out-of-view', direction === 'down');
      }, {
        offset: function () {
          return -li.height();
        }
      });
      li.waypoint(function (direction) {
        li.toggleClass('out-of-view', direction === 'up');
      }, {
        offset: '100%'
      });
    };
    $scope.parseThread = function(msgs, callback) {
    	console.log(msgs.threads.length);
    	if (msgs.threads.length>0) {
    	   msgs.threads.reverse();
    	   //console.log(msgs.threads);
         _.each(msgs.threads, function(data){
              var chatList = $('.chats ul');
              var li = document.createElement('li');
              var msg = document.createElement('p');
              var pic = document.createElement('img');
              msg.innerHTML = data.msg;
              pic.src = data.pic;
              li.appendChild(msg);
              li.appendChild(pic);
              chatList.append(li);
           });
    	  }
    callback();
    };
    $scope.parsekey = function(ev) {
      $('#counter').text(parseInt($scope.CHAR_LIMIT - $('#add-chat').val().length));
    };
    $scope.promptCamera = function () {
        if (navigator.getMedia) {
          $scope.showCamera = true;
          cameraHelper.startStream();
        } else {
          $scope.back();
        }
      };
    $scope.recordCamera = function () {
        $('#add-chat').prop('readonly', true);
        $scope.canSend = false;
        $('#add-chat-blocker').removeClass('hidden');
        cameraHelper.startScreenshot(function (pictureData) {
          $scope.$apply(function () {
          	if (pictureData){
               $scope.picture = pictureData;
               var msg = {
                 type: 'meat',
               	 pic: $scope.picture,
               	 msg: $('#add-chat').val(),
               	 fingerprint: $scope.fingerprint,
               	 room: $scope.roomId
                 };
               $scope.ws.send(JSON.stringify(msg));
          	   }
          	$('#add-chat').val('');
            $('#add-chat').prop('readonly', false);
            $scope.canSend = true;
            $('#add-chat-blocker').addClass('hidden');
          });
        });
      };
    $scope.sendMessage = function (ev) {
        if ($scope.canSend)
           {
           $scope.recordCamera();
           }
           else
              {
              console.log('on it');
              }
      };
    $scope.resetForm();
    $scope.promptCamera();
    });