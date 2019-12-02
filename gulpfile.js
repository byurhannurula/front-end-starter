const gulp = require('gulp')
const plugin = require('gulp-load-plugins')()
const include = require('gulp-file-include')
const htmlBeautify = require('gulp-html-beautify')
const browserSync = require('browser-sync').create()
const chalk = require('chalk')
const del = require('del')

const { paths, tasks } = require('./config')

const errorMessage = err => console.log(err.message)
const glog = console.log

gulp.task('compileViews', done => {
  glog(chalk.red.bold('— Gulp: Compiling Views files...'))

  gulp
    .src(`${paths.src.views}/*.html`)
    .pipe(plugin.plumber({ errorHandler: errorMessage }))
    .pipe(
      include({
        prefix: '@',
        basepath: paths.src.views
      })
    )
    .pipe(
      htmlBeautify({
        indent_with_tabs: true,
        indent_size: 2
      })
    )
    .pipe(gulp.dest(paths.dist.views))
    .pipe(browserSync.reload({ stream: true }))

  done()
})

gulp.task('compileStyles', done => {
  glog(chalk.red.bold('— Gulp: Compiling SASS files...'))

  gulp
    .src(`${paths.src.styles}/app.scss`)
    .pipe(plugin.plumber({ errorHandler: errorMessage }))
    .pipe(plugin.sass())
    .pipe(plugin.autoprefixer())
    .pipe(gulp.dest(paths.dist.styles))
    .pipe(browserSync.reload({ stream: true }))

  done()
})

gulp.task('compileScripts', done => {
  glog(chalk.red.bold('— Gulp: Compiling/Minifying JavaScript files...'))
  gulp
    .src(`${paths.src.scripts}/**/*.js`)
    .pipe(plugin.plumber({ errorHandler: errorMessage }))
    .pipe(plugin.concat('app.js'))
    .pipe(plugin.uglify())
    .pipe(gulp.dest(paths.dist.scripts))
    .pipe(browserSync.reload({ stream: true }))

  done()
})

gulp.task('optimizeImages', done => {
  glog(chalk.red.bold('— Gulp: Optimizing images...'))

  gulp
    .src(`${paths.src.img}/**/*.*`)
    .pipe(plugin.plumber({ errorHandler: errorMessage }))
    .pipe(
      plugin.imagemin([
        plugin.imagemin.gifsicle({ interlaced: true }),
        plugin.imagemin.jpegtran({ progressive: true }),
        plugin.imagemin.optipng({ optimizationLevel: 5 }),
        plugin.imagemin.svgo({
          plugins: [{ removeViewBox: true }]
        })
      ])
    )
    .pipe(gulp.dest(paths.dist.img))
    .pipe(browserSync.reload({ stream: true }))

  done()
})

gulp.task('startServer', done => {
  glog(chalk.red.bold('— Gulp: Starting server...'))

  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: paths.dist
    }
  })

  done()
})

gulp.task('cleanDist', done => {
  glog(chalk.red.bold('— Gulp: Cleanin Build folder...'))
  del.sync(paths.dist.views)
  done()
})

gulp.task('watchFiles', () => {
  gulp.watch(`${paths.watch.views}`, gulp.series('compileViews'))
  gulp.watch(`${paths.watch.styles}`, gulp.series('compileStyles'))
  gulp.watch(`${paths.watch.scripts}`, gulp.series('compileScripts'))
})

exports.dev = gulp.series('cleanDist', tasks.dev)
exports.build = gulp.series('cleanDist', tasks.build)
