'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

// Paths
const src = './source';
const dist = './build';

const srcPaths = {
	html: `${src}/views`,
  css: `${src}/sass`,
  js: `${src}/js`,
  img: `${src}/img`,
  fonts: `${src}/fonts`
};

const distPaths = {
  html: `${dist}`,
  css: `${dist}/css`,
  js: `${dist}/js`,
  img: `${dist}/img`,
  fonts: `${dist}/fonts`
};

// Compile HTML
gulp.task('views', () => {
	return gulp.src([`${srcPaths.html}/*.html`])
    .pipe(gulp.dest(distPaths.html))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('scripts', () => {
  return gulp.src(`${srcPaths.js}/**/*.js`)
    .pipe(gulp.dest(distPaths.js))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Compile SCSS to CSS
gulp.task('styles', () => {
  return gulp.src([`${srcPaths.css}/main.sass`])
    .pipe(plumber())
		.pipe(sass())
    .pipe(autoprefixer(['last 10 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(cssnano({
      discardComments: { removeAll: true }
    }))
    .pipe(gulp.dest(distPaths.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Minify images/icons/svg
gulp.task('images', () => {
  return gulp.src(`${srcPaths.img}/**/*`)
    .pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
    }))
    .pipe(gulp.dest(distPaths.img))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Serve
gulp.task('serve', ['views', 'styles', 'scripts', 'images'], () => {
  browserSync.init({
    server: {
			baseDir: `${dist}`
		}
	});

	gulp.watch(`${srcPaths.html}/*.html`, ['views']);
	gulp.watch(`${srcPaths.js}/**/*.js`, ['scripts']);
	gulp.watch(`${srcPaths.css}/**/*.sass`, ['styles']);
});


// Default task
gulp.task('default', ['serve']);