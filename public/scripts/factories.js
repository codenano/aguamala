'use strict';

angular.module('h2o.factories', []).
  factory('auth',function($rootScope, $http, $location, $window) {
    var login = function (uname) {
          $rootScope.isAuthenticated = true;
          $rootScope.uname = uname;
          //console.log($rootScope.heartbeats+':'+$rootScope.state+'@'+uname);
          window.location.href = '/';
       };
    var logout = function() {
       var log = {
         type: 'signOut',
         uname: $rootScope.uname
         };
       $rootScope.socket.send(JSON.stringify(log));
       $rootScope.isAuthenticated = false;
       $rootScope.uname = 'alien';
       window.location.href = '/signout';
       };
       return {
         login: login,
         logout: logout
       };
  }).
  factory('transformer', function() {
    var meshu = 'gha';
    var drawSquare = function(ctx, img, start_array, len,  a0, a1, a2, a3) {
      function toV(array) {
        return new Vector(array[0], array[1]);
      }
      _drawSquare(ctx, img, toV(start_array), len, toV(a0), toV(a1), toV(a2), toV(a3));
    };
    function _drawSquare(ctx, img, start, len,  p0, p1, p2, p3) {
      var clipTriangle;
      var dest;
    
      // 左上
    　  clipTriangle = new Triangle(p0, p1, p2);
      dest = new Triangle(p0, p1, p2);
      drawTriangle(ctx, img, start, len, clipTriangle, dest);
  
      // 右下
      clipTriangle = new Triangle(p1, p2, p3);
      dest = new Triangle(p1.plus(p2).minus(p3), p1, p2);
      drawTriangle(ctx, img, start, len, clipTriangle, dest);
    }
    
    function drawTriangle(ctx, img, start, len, clipTriangle, dest) {
      ctx.save();
    
      // 白い余白が出ないようにクリップ領域を広げる
      var t = clipTriangle.extend();
  
      ctx.beginPath();
      ctx.moveTo(t.p0.x, t.p0.y);
      ctx.lineTo(t.p1.x, t.p1.y);
      ctx.lineTo(t.p2.x, t.p2.y);
      ctx.closePath();
      //ctx.stroke();
      ctx.clip();
  
      var d1 = dest.p1.minus(dest.p0);
      var d2 = dest.p2.minus(dest.p0);
      var ma = Matrix.create(d1, d2).scalarMultiplication(1/len);
  
      //  | m11  m21   dx |
      //  | m12  m22   dy |
      //  |   0    0    1 |
      // context.transform(m11, m12, m21, m22, dx, dy)
      ctx.transform(ma.a, ma.c, ma.b, ma.d, dest.p0.x, dest.p0.y);
      ctx.drawImage(img, start.x, start.y, img.width - start.x, img.height - start.y,
    　　　　  　　　　　　　　　　     　0,       0, img.width - start.x, img.height - start.y);
      ctx.restore();
    }
  
    function Vector(x,
                    y) {
      this.x = x;
      this.y = y;
    }
    Vector.prototype.plus = function(v) {
      return new Vector(this.x + v.x,
                        this.y + v.y);
    };
    Vector.prototype.minus = function(v) {
      return new Vector(this.x - v.x,
                        this.y - v.y);
    };
    Vector.prototype.scalarMultiplication = function(l) {
      return new Vector(this.x * l,
                        this.y * l);
    };
    Vector.prototype.normal = function() {
      var l = Math.sqrt(this.x * this.x + this.y * this.y);
      return this.scalarMultiplication(1/l);
    };
  
    function Matrix(a, b,
                    c, d) {
      this.a = a;
      this.b = b;
      this.c = c;
      this.d = d;
    }
    Matrix.create = function(v1, v2) {
      return new Matrix(v1.x, v2.x,
                        v1.y, v2.y);
    };
    Matrix.prototype.product = function(v) {
      return new Vector(this.a * v.x + this.b * v.y,
                        this.c * v.x + this.d * v.y);
    };
    Matrix.prototype.scalarMultiplication = function(l) {
      return new Matrix(this.a * l, this.b * l,
                       this.c * l, this.d * l);
    };
    Matrix.prototype.minus = function(m) {
      return new Matrix(this.a - m.a, this.b - m.b,
                        this.c - m.c, this.d - m.d);
    };
  
    function Triangle(p0, p1, p2) {
      this.p0 = p0;
      this.p1 = p1;
      this.p2 = p2;
    }
    Triangle.prototype.center = function() {
      return this.p0.plus(this.p1).plus(this.p2).scalarMultiplication(1/3);
    };
    Triangle.prototype.extend = function() {
      var c = this.center();
      var d0 = this.p0.minus(c).normal();
      var d1 = this.p1.minus(c).normal();
      var d2 = this.p2.minus(c).normal();
      return new Triangle(this.p0.plus(d0), this.p1.plus(d1), this.p2.plus(d2));
    };
    
    
    return {
      drawSquare: drawSquare,
      meshu: meshu
    };
  }).
  factory('cameraHelper', function ($rootScope, $http) {
    var videoShooter;
    var svg = $(null);

    var progressCircleTo = function (progressRatio) {
      var circle = $('path#arc');

      var thickness = 25;
      var angle = progressRatio * (360 + thickness); // adding thickness accounts for overlap
      var offsetX = 256 / 2;
      var offsetY = 128 / 2;
      var radius = offsetY - (thickness / 2);

      var radians = (angle / 180) * Math.PI;
      var x = offsetX + Math.cos(radians) * radius;
      var y = offsetY + Math.sin(radians) * radius;
      var d;

      if (progressRatio === 0) {
        d = 'M0,0 M ' + x + ' ' + y;
      } else {
        d = circle.attr('d') + ' L ' + x + ' ' + y;
      }
      circle.attr('d', d).attr('stroke-width', thickness);
    };

    var getScreenshot = function (callback, progressCallback, numFrames, interval) {
      if (videoShooter) {
        svg.attr('class', 'progress visible');
        videoShooter.getShot(callback, progressCallback, numFrames, interval);
      } else {
        callback('');
      }
    };
    var startStream = function (cb) {
      GumHelper.startVideoStreaming(function (err, stream, videoElement, width, height) {
        if (err) {
          cb(err);
          videoShooter = null;
        } else {

          svg = $('<svg class="progress" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 256 128" preserveAspectRatio="xMidYMid" hidden><path d="M0,0 " id="arc" fill="none" stroke="rgba(87,223,180,0.9)"></svg>');

          // TODO: use the provided width and height to determine
          // smaller dimensions with proper aspect ratio
          videoElement.width = 120;
          videoElement.height = 90;
          $('#video-preview').append(svg)
                             .append(videoElement); // TODO: switch to directive
          videoElement.play();
          videoShooter = new VideoShooter(videoElement);
        }
      });
    };

    var startScreenshot = function (callback) {
      progressCircleTo(0);

      svg.attr('class', 'progress visible');

      getScreenshot(function (pictureData) {
        svg.attr('class', 'progress');
        callback(pictureData);
      }, function (progress) {
        progressCircleTo(progress);
      }, 10, 0.1);
    };

    var resetStream = function () {
      videoShooter = null;
      GumHelper.stopVideoStreaming();
    };
    return {
      startScreenshot: startScreenshot,
      startStream: startStream,
      videoShooter: videoShooter,
      resetStream: resetStream
      };
    }).
  factory('localCache', function ($rootScope) {

    });