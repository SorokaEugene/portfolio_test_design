var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var watch = require('gulp-watch');
var prefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var rigger = require('gulp-rigger');
var uglify = require('gulp-uglifyjs');
var sourcemaps = require('gulp-sourcemaps');
var cssmin = require('gulp-minify-css');
var rimraf = require('rimraf');
var pngquant = require('pngquant');

var path = {
  build: {
    html: 'dist/',
    css: 'dist/css',
    js: 'dist/js',
    img: 'dist/img',
    fonts: 'dist/fonts'
  },
  src: {
    html: 'app/**/*.html',
    less: 'app/less/**/*.less',
    js: 'app/js/**/*.js',
    img: 'app/img/**/*.*',
    fonts: 'app/fonts/**/*.*'
  },
  watch: {
    html: 'app/*.html',
    style: 'app/less/**/*.less',
    js: 'app/js/**/*.js',
    img: 'app/img/**/*.*',
    fonts: 'app/fonts/**/*.*'
  },
  clean: './dist'
}


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    },

    notify: false
  })
});

gulp.task('html:build', function() {
  gulp.src(path.src.html)
  .pipe(rigger())
  .pipe(gulp.dest(path.build.html))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('js:build', function() {
  gulp.src(path.src.js)
  .pipe(rigger())
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(path.build.js))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('css:build', function() {
  gulp.src(path.src.less)
  .pipe(sourcemaps.init())
  .pipe(less())
  .pipe(prefixer())
  .pipe(cssmin())
  .pipe(sourcemaps.write())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(path.build.css))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('img:build', function() {
  gulp.src(path.src.img)
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    use: [pngquant()],
    interlaced: true
  }))
  .pipe(gulp.dest(path.build.img))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
  .pipe(gulp.dest(path.build.fonts));
});

gulp.task('less', function() {
  gulp.src('app/less/**/*.less')
  .pipe(less())
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}));
});

gulp.task('build', [
  'html:build',
  'js:build',
  'css:build',
  'img:build',
  'fonts:build'
  ]);

gulp.task('watch', function() {
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });

  watch([path.watch.style], function(event, cb) {
    gulp.start('css:build');
  });

  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });

  watch([path.watch.img], function(event, cb) {
    gulp.start('img:build');
  });

  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
  //gulp.watch('app/less/**/*.less', ['less']);
  //gulp.watch('app/**/*.html', browserSync.reload);
  //gulp.watch('app/**/*.js', browserSync.reload);
});

gulp.task('clean', function(cb) {
  rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'browser-sync', 'watch']);