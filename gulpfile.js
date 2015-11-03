var gulp = require('gulp');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var less = require('gulp-less');
var path = require('path');
var plumber = require('gulp-plumber');
var coffee = require('gulp-coffee');

gulp.task('watch', function (cb) {
    watch('less/**/*.less', function () {
      return gulp.src('./less/**/*.less')
        .pipe(plumber())
        .pipe(less({
          paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./css'));
    });

    watch('coffee/**/*.coffee', function () {
      gulp.src('./coffee/**/*.coffee')
          .pipe(plumber())
          .pipe(coffee())
          .pipe(concat('all.js'))
          .pipe(gulp.dest('./js/'))
    });
});
