'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const electron = require('electron-connect').server.create();

const paths = {
  browser: './main.js',
  renderer: ['renderer.js', './js/**/*.js', 'index.html', './css/main.css'],
  sass: './css/sass/**/*.scss',
  css: './css'
}

gulp.task('electron:watch', () => {
  electron.start();
  gulp.watch(paths.browser, electron.restart);
  gulp.watch(paths.renderer, electron.reload);
});

gulp.task('sass', () => {
  return gulp.src(paths.sass)
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest(paths.css))
});
 
gulp.task('sass:watch', () => {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('default', ['sass', 'sass:watch', 'electron:watch']);