'use strict';

angular.module('h2o.controllers', [
   'h2o.meatchat',
   'h2o.aguamala'
   ]).
  controller('h2o', function($rootScope, $scope, $http, $location, cameraHelper){
    $scope.homeLink = document.getElementById('logoapp');
    $scope.homeLink.addEventListener('click', function(){
      $scope.currentLink.className = '';
      });
  	$('#logoapp').on('click', function(){
  		  cameraHelper.resetStream();
        $scope.$apply(function(){
        	$location.path("/");
        });
  		});    
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
    $scope.menuList = document.getElementById('menu_list');
    $rootScope.$on("$locationChangeSuccess", function(event, next, current) {
      $rootScope.socket.onmessage = function (event) {
      	  var data = JSON.parse(event.data);
          if ((data)&&(data.type)){
      	     switch(data.type) {
      	     	 case 'start':
      	     	        if ($rootScope.state === 'loading') {
      	     	           $rootScope.menuItems = data.menu;
        	               _.each(data.menu, function(value){
                             var li = document.createElement('li');
                             var link = document.createElement('a');
                             if (value.url === $location.path()) {
                                li.className = 'active'; 
                                $scope.currentLink = li;
                                }
                             link.innerHTML = value.name.toUpperCase();
                             li.dataset.url = value.url;
                             link.addEventListener('click', function(){
                                   cameraHelper.resetStream();
                                   var links = this.parentNode.parentNode.childNodes;
                                   for(var i=0; i<links.length; i++) {
                                      if (links[i] !== this.parentNode)
                                         links[i].className = '';
                                      else {
                                         links[i].className = 'active';
                                         $scope.currentLink = this.parentNode;
                                         }
                                      }
                                   $scope.$apply(function(){
                                     $location.path(value.url);
                                   });                            	
                         	       }, false);
                         li.appendChild(link);
                         $scope.menuList.appendChild(li);
                         $rootScope.state = 'start';
        	             });
                       }    	     	        
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
               case 'pong':   
                      console.log('pong');
               break;              
      	       }
              }    
          };
    });  
    });