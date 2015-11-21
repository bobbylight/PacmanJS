(function() {
   'use strict';
   
   var gulp = require('gulp');
   var debug = require('gulp-debug');
   var del = require('del');
   var runSequence = require('run-sequence');
   var usemin = require('gulp-usemin');
   var uglify = require('gulp-uglify');
   //var minifyHtml = require('gulp-minify-html');
   var concatCss = require('gulp-concat-css');
   var cssmin = require('gulp-cssmin');
   var rev = require('gulp-rev');
   var jshint = require('gulp-jshint');
   var stylish = require('jshint-stylish');
   
   gulp.task('clean', function() {
      return del([
         './dist'
      ]);
   });
   
   gulp.task('usemin', function() {
      return gulp.src([ 'src/index.html' ])
         .pipe(debug({ title: 'File going through usemin: ' }))
         .pipe(usemin({
            css: [ rev ],
            js: [ uglify, rev ],
            inlinejs: [ uglify ]
            //, html: [ minifyHtml({ empty: true }) ]
         }))
         .pipe(gulp.dest('dist/'));
   });
   
   gulp.task('cssmin', function() {
      gulp.src('src/css/all.css')
         .pipe(concatCss('all.css'))
         .pipe(cssmin())
         .pipe(gulp.dest('dist/css/'));
   });
   
   gulp.task('jshint', function() {
      return gulp.src([ 'src/**/*.js' ])
         .pipe(jshint())
         .pipe(jshint.reporter(stylish))
         .pipe(jshint.reporter('fail'));
   });
   
   gulp.task('copy-non-minified-files', function() {
      return gulp.src([ 'src/**', 'src/.htaccess', '!src/css/**', '!src/js/**', '!src/index.html' ])
         .pipe(gulp.dest('dist/'));
   });
   
   gulp.task('default', function() {
      runSequence('jshint', 'clean', 'usemin', 'cssmin', 'copy-non-minified-files');
   });
   
   gulp.task('watch-js', function() {
      gulp.watch('src/**/*.js', [ 'jshint' ]);
   });

})();
