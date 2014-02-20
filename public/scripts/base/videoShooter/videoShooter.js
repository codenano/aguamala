'use strict';

function VideoShooter (videoElement) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  canvas.width = videoElement.width;
  canvas.height = videoElement.height;

  this.getShot = function (callback, progressCallback, numFrames, interval) {
    numFrames = numFrames !== undefined ? numFrames : 4;
    interval = interval !== undefined ? interval : 0.1; // In seconds

    var pendingFrames = numFrames;
    var ag = new Animated_GIF({ workerPath: './scripts/lib/animated-gif/dist/Animated_GIF.worker.min.js' });
    ag.setSize(canvas.width, canvas.height);
    ag.setDelay(interval);

    captureFrame();

    function captureFrame() {
      ag.addFrame(videoElement);
      pendingFrames--;

      progressCallback((numFrames - pendingFrames) / numFrames);

      if (pendingFrames > 0) {
        setTimeout(captureFrame, interval * 1000); // timeouts are in milliseconds
      } else {
        ag.getBase64GIF(function (image) {
        	ag.destroy();
          var img = document.createElement('img');
          img.src = image;
          callback(image);
          image = null;
        });
      }
    }

  };
}
