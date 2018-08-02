import gulp from 'gulp';
import sass from 'gulp-sass';
import cache from 'gulp-cache';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import plumber from 'gulp-plumber';
import cssnano from 'gulp-cssnano';
import imagemin from 'gulp-imagemin';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import nunjucksReder from 'gulp-nunjucks-render';
import fileinclude from 'gulp-file-include';
import browserSync from 'browser-sync';

const reload = browserSync.reload();

// configuration
const config = {
  browserList: ['last 2 version'],
};

// paths
const src = './src';
const dist = './build';

const paths = {
  viewsPath: `${src}/views`,
  viewsSrc: `${src}/views/pages/*`,
  viewsDist: `${dist}`,
  watchViews: `${src}/views/**/*`,

  stylesSrc: `${src}/styles/main.scss`,
  stylesDist: `${dist}/css`,
  watchStyles: `${src}/styles/**/*.scss`,

  scriptsSrc: `${src}/scripts/**/*.js`,
  scriptsDist: `${dist}/js`,
  watchScripts: `${src}/scripts/**/*.js`,

  imagesSrc: `${src}/images/**/*`,
  imagesDist: `${dist}/images`,

  fontsSrc: `${src}/fonts/**/*`,
  fontsDist: `${dist}/fonts`,
};

const errMsg = (err) => {
  console.log(err.message);  
}

// render views
gulp.task('views', () => {
  return gulp.src(paths.viewsSrc)
    .pipe(plumber({ errorHandler: errMsg }))
    // .pipe(fileinclude({
    //   prefix: '@',
    //   basepath: paths.viewsPath
    // }))
    .pipe(nunjucksReder({
      path: [paths.viewsPath],
      watch: true
    }))
    .pipe(gulp.dest(paths.viewsDist))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// SASS styles
gulp.task('styles', () => {
  return gulp.src(paths.stylesSrc)
    .pipe(plumber({ errorHandler: errMsg }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: config.browserList
    }))
    // .pipe(cssnano())
    .pipe(rename({
      basename: 'app'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.stylesDist))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// JS scripts
gulp.task('scripts', () => {
  return gulp.src(paths.scriptsSrc)
    .pipe(plumber({ errorHandler: errMsg }))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(rename({
      basename: 'app'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scriptsDist))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// image optimization
gulp.task('images', () => {
  gulp.src(paths.imagesSrc)
    .pipe(cache(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(paths.imagesDist));
});

// serve
gulp.task('serve', () => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: `${dist}`
    }
  });
});


// default task to run and watch
gulp.task('default', ['views', 'styles', 'scripts', 'images', 'serve'], () => {
  gulp.watch(paths.watchViews, ['views']);
  gulp.watch(paths.watchStyles, ['styles']);
  gulp.watch(paths.watchScripts, ['scripts']);
});