// third-party dependencies
const gulp = require('gulp');
const gulpSize = require('gulp-size');

// browserify
const browserify = require('browserify');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');

// browser-sync
var browserSync = require('browser-sync').create();

gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: 'src/index.js',
    debug: false,

    // defining transforms here will avoid crashing your stream
    transform: [
      // ['brfs', {}]
      // ['vueify', { global: true }],
      // ['babelify', { 'presets': ['env'] }],
      // ['deamdify', {}]
    ],
  });

  return b.bundle()
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist'))
    .pipe(gulpSize());
});

gulp.task('distribute', ['javascript'], function () {
  gulp.src([
    'src/index.html',
    'src/resources/**/*'
  ], { base: 'src' })
  .pipe(gulp.dest('dist'))
});

gulp.task('develop', ['javascript'], function () {

  gulp.watch('src/**/*.js', ['javascript']);

  gulp.watch([
    'dist/**/*.js',
    'src/index.html',
    'src/**/*.css',
  ], browserSync.reload);

  browserSync.init({
    server: ['dist', 'src'],
  });
});
