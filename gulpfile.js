var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    bower = require('gulp-bower'),
    usemin = require('gulp-usemin'), // à améliorer
    del = require('del');

// On charge les styles
gulp.task('css', function() {
  return sass('src/styles/main.scss', { style: 'expanded' })
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

// On charge les pages js
gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
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

gulp.task('usemin', function() {
  return gulp.src('src/*.html')
    .pipe(usemin({
      js: [ uglify ]
    }))
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: 'usemin task complete' }));
});

// On supprime la distrib qu'on a créé
gulp.task('clean', function() {
    return del(['dist']);
});

// On observe le changement de fichier pour recharger la page
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['css']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['js']);

  // Watch image files
  gulp.watch('src/img/**/*', ['images']);
    


  // Changement dans les dépendances ?
  gulp.watch('bower_components/*', ['bower']);
    
  // Watch the html files
  //gulp.watch('src/{,partial/}/*.html', ['extend']);
  gulp.watch('src/*.html', ['usemin']);
  
    
  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);

});


gulp.task('default', ['clean'], function() {
    gulp.start('bower', 'css', 'js', 'images', 'usemin');
});