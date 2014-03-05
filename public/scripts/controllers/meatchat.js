'use strict';
  angular.module('h2o.meatchat', []).
  controller('meatchat', function ($rootScope, $scope, $location, $http, $routeParams, cameraHelper) {
    $scope.menuList = document.getElementById('menu_list');
    $scope.app = document.getElementById('app');
    $scope.load = document.getElementById('load');
    $scope.load.style.display = 'block';
    $scope.app.style.display = 'none';    
    $scope.canSend = false;
    $scope.roomId = $routeParams.id;
    $scope.CHAR_LIMIT = 250;
    $('#add-chat').prop('readonly', true);
    $scope.canSend = false;
    $('#add-chat-blocker').removeClass('hidden');	
    $scope.$on('$routeChangeStart', function(event, current, previous, rejection) {
    var log = {
      room: $scope.roomId,
      type: 'leave'
      };
    $rootScope.socket.send(JSON.stringify(log));	
    });
    $(document).on('keydown', function (event) {
      if (event.target !== $('#add-chat')[0]) {
         $('#add-chat').focus();
         }
    });
    $scope.fingerprint = new Fingerprint({ canvas: true }).get();
    $scope.resetForm = function () {
         $scope.errors = false;
         $scope.message = '';
         $scope.picture = '';
         $scope.showCamera = false;
       };
    $scope.parseThread = function(msgs, callback) {
      if (msgs.threads.length>0) {
        _.each(msgs.threads, function(data){
              var chatList = $('.chats ul');
              var li = document.createElement('li');
              var msg = document.createElement('p');
              var pic = document.createElement('img');
              msg.innerHTML = data.msg;
              console.log(data.pic+'asd');
                      msg.innerHTML = data.msg;
                      if (data.pic)
                         pic.src = data.pic;
                      else {
                         pic.src = '/images/aguamala/aguamala-128.png';
                         pic.style.width = '90px';
                         pic.style.marginLeft = '10px';
                         }
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
                  $rootScope.socket.send(JSON.stringify(msg));
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
           if (cameraHelper.videoShooter) {   
              $scope.recordCamera();
              }
           else {
                  $scope.picture = null;
                  var msg = {
                    type: 'meat',
                    pic: $scope.picture,
                    msg: $('#add-chat').val(),
                    fingerprint: $scope.fingerprint,
                    room: $scope.roomId
                    };
                  $('#add-chat').val('');  
                  $rootScope.socket.send(JSON.stringify(msg));
              }           
           }
           else
              {
              console.log('on it');
              }
      };
    $http.get('/api/signos/'+$scope.roomId).success(function(data) {
      $scope.parseThread(data, function(){
          var log = {
                room: $scope.roomId,
                type: 'join'
                };
       $scope.intervalLoad = setInterval(function(){
       if ($rootScope.state === 'start') {
         clearInterval($scope.intervalLoad);
               $rootScope.socket.send(JSON.stringify(log));
               $scope.canSend = true;
               $('#add-chat').prop('readonly', false);
               $('#add-chat-blocker').addClass('hidden');
               $scope.app = document.getElementById('app');
               $scope.load = document.getElementById('load');
               $scope.load.style.display = 'none';
               $scope.app.style.display = 'block';
               }
       },100);  
       $scope.resetForm();
       $scope.promptCamera();
       });      
    });
  });    