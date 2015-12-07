/*global require:true, console:true */

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var del = require('del');

var hintTask = function () {
  gulp.src(['*.js', './src/js/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
};

gulp.task('hint', function() {
  hintTask();
});

var cleanTask = function () {
  console.log('CLEAN: Clean Complete');
  return del([
    'app/**/*',
    '!app/img/',
    '!app/css/',
    '!app/fonts/',
    '!app/js/',
    '!app/views/',
  ]);
};

gulp.task('clean', function() {
  cleanTask();
});

var buildTask = function() {
  gulp.src('./src/app.js')
    .pipe(gulp.dest('./app'));
  gulp.src('./src/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./app'));
  gulp.src('./src/views/*')
    .pipe(gulp.dest('./app/views'));
  gulp.src('./src/views/layouts/*')
    .pipe(gulp.dest('./app/views/layouts'));
  gulp.src('./src/img/*')
    .pipe(gulp.dest('./app/img'));
  gulp.src(['./src/css/bootstrap.css','./src/css/main.css'])
    .pipe(concat('style.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('./app/css'));
  gulp.src(['./src/js/jquery.js','./src/js/bootstrap.js'])
    .pipe(concat('lib.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js'));
  gulp.src(['./src/js/main.js'])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js'));
  console.log('\033[31m BUILD: Build Complete');
};

gulp.task('build', function() {
  buildTask();
});

var watchTask = function() {
  gulp.src('./app.js')
    .pipe(gulp.dest('./'));
  gulp.src('./src/views/*')
    .pipe(gulp.dest('./app/views'));
  gulp.src('./src/index.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./app'));
  gulp.src(['./src/css/bootstrap.css', './src/css/main.css'])
    .pipe(concat('style.min.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('./app/css'));
  gulp.src(['./src/js/main.js'])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./app/js'));
  console.log('\033[31m WATCH: Watch Complete');
};

gulp.task('watch', function() {
  watchTask();
});

var nodemonTask = function() {
  nodemon({
    tasks: ['watch'],
    script: 'app.js',
    verbose: true,
    env: { 'NODE_ENV': 'development' },
    watch: ['./src/'],
    ext: 'css js html'
  });
};

gulp.task('run', function () {
  nodemonTask();
});
