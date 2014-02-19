module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [ 'public/scripts/lib/jquery/jquery.js',
               'public/scripts/lib/underscore/underscore.js',
               'public/scripts/lib/angular/angular.js',
               'public/scripts/lib/angular-route/angular-route.js',
               'public/scripts/lib/animated-gif/dist/Animated_GIF.js',
               'public/scripts/lib/fingerprint/fingerprint.js',
               'public/scripts/lib/gumhelper/gumhelper.js',
               'public/scripts/lib/jquery-waypoints/waypoints.js',
               'public/scripts/base/videoShooter/videoShooter.js',
               'public/scripts/lib/bootstrap-sass/dist/js/bootstrap.js'],
        dest: 'public/scripts/dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/scripts/dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('default', ['concat', 'uglify']);
};