'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('cssnano');
const prefix = require('autoprefixer');
const viewsRender = require('gulp-pug');
const $ = require('gulp-load-plugins')();
const pngquant = require('imagemin-pngquant');
const browserSync = require('browser-sync').create();

// Paths
const src = './source';
const dist = './build';

const srcpaths = {
	html: `${src}/views`,
  css: `${src}/sass`,
  js: `${src}/js`,
  img: `${src}/img`,
  fonts: `${src}/fonts`
};

const distpaths = {
  html: `${dist}`,
  css: `${dist}/css`,
  js: `${dist}/js`,
  img: `${dist}/img`,
  fonts: `${dist}/fonts`
};

const error = (error) => {
	console.log(error.message);
};

// Compile HTML
gulp.task('views', () => {
	return gulp.src(`${srcpaths.html}/*.pug`)
		.pipe($.plumber({errorHandler: error}))
		.pipe(viewsRender())
    .pipe(gulp.dest(distpaths.html))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Compile SCSS to CSS
gulp.task('styles', () => {
	const plugins = [
		prefix({ browsers: ['last 2 versions'] }),
		cssnano({ discardComments: { removeAll: true } })
	];

	return gulp.src(`${srcpaths.css}/main.sass`)
		.pipe($.plumber({errorHandler: error}))
		.pipe($.sass())
		.pipe($.postcss(plugins))
    .pipe(gulp.dest(distpaths.css))
    .pipe(browserSync.stream());
});

gulp.task('scripts', () => {
	return gulp.src(`${srcpaths.js}/**/*.js`)
		.pipe($.plumber({errorHandler: error}))
    .pipe(gulp.dest(distpaths.js))
    .pipe(browserSync.stream());
});

// Minify images/icons/svg
gulp.task('images', () => {
  return gulp.src(`${srcpaths.img}/**/*`)
    .pipe($.imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
    }))
    .pipe(gulp.dest(distpaths.img));
});

// Serve
gulp.task('serve', ['views', 'styles', 'scripts', 'images'], () => {
  browserSync.init({
    server: {
			baseDir: `${dist}`
		}
	});

	gulp.watch(`${srcpaths.js}/**/*.js`, ['scripts']);
	gulp.watch(`${srcpaths.css}/**/*.sass`, ['styles']);
	gulp.watch(`${srcpaths.html}/*.+(html|pug)`, ['views']);
});


// Default task
gulp.task('default', ['serve']);