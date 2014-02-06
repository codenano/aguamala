'use strict';

angular.module('h2o.factories', []).
  factory('saleList',function() {
                        return  [
                                "VENTA", "antiguedades", "", 12, 5,
                                "VENTA", "accesorios para bebes", "", 13, 5,
                                "VENTA", "intercambio", "", 14, 5,
                                "VENTA", "bicicletas", "", 15, 5,
                                "VENTA", "botes", "", 16, 5,
                                "VENTA", "libros", "", 17, 5,
                                "VENTA", "negocios", "", 18, 5,
                                "VENTA", "carros", "", 1, 6,
                                "VENTA", "motos", "", 2, 6,
                                "VENTA", "computadoras", "", 4, 9,
                                "VENTA", "gratis", "", 5, 9,
                                "VENTA", "muebles", "", 6, 9,
                                "VENTA", "general", "", 7, 9,
                                "VENTA", "casa", "", 8, 9,
                                "VENTA", "joyeria", "", 9, 9,
                                "VENTA", "empeño", "", 10, 9,
                                "VENTA", "materiales", "", 11, 9,
                                "VENTA", "campamento", "", 12, 9,
                                "VENTA", "equipos deportivos", "", 13, 9,
                                "VENTA", "entradas", "", 14, 9,
                                "VENTA", "herramientas", "", 15, 9,
                                "VENTA", "se busca", "", 16, 9,
                                "VENTA", "autopartes", "", 17, 9,
                                "VENTA", "electrodomedicos", "", 18, 9,
                                "VENTA", "artesania", "", 4, 6,
                                "VENTA", "cosmeticos", "", 5, 6,
                                "VENTA", "camiones", "", 6, 6,
                                "VENTA", "cds/dvd/vhs", "", 7, 6,
                                "VENTA", "telefonos", "", 8, 6,
                                "VENTA", "ropa", "", 9, 6,
                                "VENTA", "coleccionable", "", 10, 6,
                                "VENTA", "electronica", "", 11, 6,
                                "VENTA", "cosecha/jardineria", "", 12, 6,
                                "VENTA", "VENTA de garaje", "", 13, 6,
                                "VENTA", "equipo pesado", "", 14, 6,
                                "VENTA", "instrumentos musicales", "", 15, 6,
                                "VENTA", "foto/video", "", 16, 6,
                                "VENTA", "juguetes/juegos", "", 17, 6,
                                "VENTA", "video juegos", "", 18, 6
                        ];
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

    var startStream = function () {
      GumHelper.startVideoStreaming(function (err, stream, videoElement, width, height) {
        if (err) {
          console.log(err);
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
      resetStream: resetStream
      };
    }).
    factory('localCache', function ($rootScope) {

    });