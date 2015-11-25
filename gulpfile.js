var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    del = require('del'),
	promise = require('es6-promise');


// On charge les styles
gulp.task('css', function() {
  return gulp.src('src/styles/**/*.scss')
	.pipe(plumber())
  	.pipe(sass())
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// On charge les pages js
gulp.task('js', function() {
  return gulp.src(['src/js/*.js', 'src/js/app/App.js','src/js/app/Page.js','src/js/app/Page_Home.js', 'src/js/app/Page_ExploreWords.js', 'src/js/app/Page_ExploreItems.js', 'src/js/app/Page_Profile.js','src/js/app/main.js', 'src/js/**/*.js'])
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(plumber())
	.pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// On charge les images
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// On supprime la distrib qu'on a créé
gulp.task('clean', function () {
  return del([
    'dist/img',
    'dist/js',
    'dist/styles',
    // we don't want to clean this file though so we negate the pattern
    '!dist/.htaccess',
    '!dist/fonts',
    '!dist/index.html',
    '!dist/particles.json',
    '!dist/api.php'
  ]);
});


// On observe le changement de fichier pour recharger la page
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['css']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['js']);

  // Watch image files
  gulp.watch('src/img/**/*', ['images']);
    
  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});


gulp.task('default', ['clean'], function() {
    gulp.start('css', 'js', 'images');
});