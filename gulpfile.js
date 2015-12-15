var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync').create();
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var del = require('del');

var hintTask = function() {
  gulp.src(['*.js', './src/js/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
};

gulp.task('hint', function() {
  hintTask();
});


var cleanTask = function() {
  console.log('CLEAN: Clean Complete');
  return del([
    'app/**/*',
    '!app/img/',
    '!app/css/',
    '!app/fonts/',
    '!app/js/',
    '!app/views/',
    '!app/models/',
    '!app/controllers/'
  ]);
};

gulp.task('clean', function() {
  cleanTask();
});


var buildTask = function() {
  gulp.src([
    './src/css/bootstrap.css',
    './src/css/font-awesome.css',
    './src/css/main.css'
  ])
    .pipe(concat('style.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('./app/css'));
  gulp.src('./src/img/*')
    .pipe(gulp.dest('./app/img'));
  gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./app/fonts'));
  gulp.src([
    './src/js/jquery.js',
    './src/js/bootstrap.js',
    './src/js/bootstrap-datepicker.js',
    './src/js/bootstrap-validator.js'
  ])
    .pipe(concat('lib.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js'));
  gulp.src(['./src/js/main.js'])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js'));
  gulp.src('./src/views/**/*')
    .pipe(gulp.dest('./app/views'));
  gulp.src('./src/models/**/*')
    .pipe(gulp.dest('./app/models'));
  gulp.src('./src/controllers/**/*')
    .pipe(gulp.dest('./app/controllers'));
  console.log('BUILD: Build Complete');
};

gulp.task('build', function() {
  buildTask();
});


var watchTask = function() {
  gulp.src([
    './src/css/bootstrap.css',
    './src/css/bootstrap-datepicker.css',
    './src/css/font-awesome.css',
    './src/css/main.css'
  ])
    .pipe(concat('style.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('./app/css'));
  gulp.src([
    './src/js/jquery.js',
    './src/js/bootstrap.js',
    './src/js/bootstrap-datepicker.js',
    './src/js/bootstrap-validator.js'
  ])
    .pipe(concat('lib.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js'));
  gulp.src(['./src/js/main.js'])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js'));
  gulp.src('./src/models/**/*')
    //.pipe(uglify())
    .pipe(gulp.dest('./app/models'));
  gulp.src('./src/views/**/*')
    //.pipe(uglify())
    .pipe(gulp.dest('./app/views'));
  gulp.src('./src/controllers/**/*')
    //.pipe(uglify())
    .pipe(gulp.dest('./app/controllers'));
  console.log('WATCH: Watch Complete');
};

gulp.task('watch', function() {
  watchTask();
});


var syncTask = function() {
    browserSync.init({
        proxy: {
          target: 'https://juryd.macs',
          ws: true
        },
        https: true,
        files: ['./src/**/*.*'],
        port: 7000,
    });
};

gulp.task('sync', function() {
  watchTask();
  syncTask();
});


var nodemonTask = function() {
  nodemon({
    tasks: ['watch'],
    env: { 'NODE_ENV': 'development' },
    script: 'app.js',
    verbose: true,
    watch: [
      './src/',
      './models/',
      './controllers',
      './app.js'
    ],
    ext: 'js jade hbs html css'
  });
};

gulp.task('run', function () {
  nodemonTask();
});
