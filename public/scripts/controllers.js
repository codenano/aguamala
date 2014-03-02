'use strict';

angular.module('h2o.controllers', [
   'h2o.meatchat',
   'h2o.aguamala',
   'h2o.app'
   ]).
  controller('h2o', function($rootScope, $scope, $http, $location, cameraHelper, auth){
    $scope.homeLink = document.getElementById('logoapp');
    $rootScope.menuList = document.getElementById('menu_list');
    $rootScope.heartbeats = 0;
    $scope.homeLink.addEventListener('click', function(){
      $scope.currentLink.className = '';
      });
    var $rota = $('#load'),
        degree = 0,
        timer;
    $scope.rotate = function() {    
        $rota.css({ transform: 'rotate(' + degree + 'deg)'});
        // timeout increase degrees:
        timer = setTimeout(function() {
            ++degree;
            $scope.rotate(); // loop it
        },25);
    };
    $scope.rotate();    // run it!        
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
    $rootScope.loadMenu = function(){
      if ($rootScope.state === 'loading') {
        _.each($rootScope.menuItems, function(value){
             var li = document.createElement('li');
             var link = document.createElement('a');
             if (value.url === $location.path()) {
                li.className = 'active'; 
                $scope.currentLink = li;
                }
             link.innerHTML = value.name.toUpperCase();
             li.dataset.url = value.url;
             link.addEventListener('click', function(){
                   if ($location.path()!==value.url)
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
         $rootScope.menuList.appendChild(li);
         $rootScope.state = 'start';
         });
       }
       else {
          var links = $rootScope.menuList.childNodes;
          for(var i=0; i<links.length; i++) {
             if (links[i].dataset.url!==$location.path())
                links[i].className = ''; 
             else
                links[i].className = 'active'; 
             }
          }
    };
    $rootScope.$on("$locationChangeSuccess", function(event, next, current) {
      $rootScope.socket.onmessage = function (event) {
        var data = JSON.parse(event.data);
          if ((data)&&(data.type)){
            switch(data.type) {
               case 'start':
                      $rootScope.uname = data.uname;
                      $rootScope.menuItems = data.menu;
                      $scope.loadMenu();
                      console.log('start');
               break;
               case 'meat':   
                      var chatList = document.getElementById('chatList');
                      var li = document.createElement('li');
                      var msg = document.createElement('p');
                      var pic = document.createElement('img');
                      msg.innerHTML = data.msg;
                      if (data.pic)
                         pic.src = data.pic;
                      else {
                         //pic.className = 'picNull';
                         pic.src = '/images/aguamala/aguamala-128.png';
                         pic.style.width = '90px';
                         pic.style.marginLeft = '10px';
                         }
                      li.appendChild(msg);
                      li.appendChild(pic);
                      chatList.appendChild(li);
                      $scope.setupWaypoints(li);
               break;
               case 'pong':
                    console.log($rootScope.uname);
                    $rootScope.heartbeats++;  
               break;
               case 'sign_in_fail':   
                    console.log(data.response.toString());  
               break;                 
               case 'sign_in_ok':   
                    //console.log(data.response.toString());
                    auth.login(data.response);
               break;
               }
              }    
          };
    });  
    });