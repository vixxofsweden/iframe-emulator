module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      less: {
        files: ['example/*.less'],
        tasks: ['less']
      },
      js: {
        files: ['jq-iframe.js'],
        tasks: ['uglify']
      }
    },
    browserSync: {
      bsFiles: {
        src: ['*.css', '*.js', 'example/*.html', 'example/*.js', 'example/*.css']
      },
      options: {
        server: './',
        browser: 'chrome',
        index: './example/index.html',
        watchTask: true
      }
    },
    less: {
      'example/public/styles.css': ['example/*.less']
    },
    uglify: {
      nonMin: {
        options: {
          compress: false,
          beautify: true
        },
        files: [{
          'dist/iframeify.js': ['iframeify.js']
        }]
      },
      min: {
        options: {
          mangle: true,
          sourceMap: true
        },
        files: {
          'dist/iframeify.min.js': ['iframeify.js'],
          'example/public/iframeify.min.js': ['iframeify.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['browserSync', 'watch']);
  grunt.registerTask('build', ['less', 'uglify']);

};
