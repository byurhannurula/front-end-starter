const gulp = require('gulp')
const { sync } = require('del')
const $ = require('gulp-load-plugins')()
const browserSync = require('browser-sync').create()

const { routes, tasks } = require('./config')

const dev = $.environments.development
const prod = $.environments.production

const errorMessage = err => console.log(err.message)

gulp.task('views', done => {
  gulp
    .src(`${routes.src.views}/*.+(html|pug)`)
    .pipe($.plumber({ errorHandler: errorMessage }))
    .pipe($.pug())
    .pipe(
      $.htmlBeautify({
        indent_with_tabs: true,
        indent_size: 2
      })
    )
    .pipe(gulp.dest(routes.dist.views))
    .pipe(browserSync.reload({ stream: true }))

  done()
})

gulp.task('styles', done => {
  gulp
    .src(`${routes.src.styles}/app.scss`)
    .pipe($.plumber({ errorHandler: errorMessage }))
    .pipe(dev($.sourcemaps.init()))
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe($.cssnano())
    .pipe(dev($.sourcemaps.write('.')))
    .pipe(gulp.dest(routes.dist.styles))
    .pipe(browserSync.stream())

  done()
})

gulp.task('scripts', done => {
  gulp
    .src(`${routes.src.scripts}/**/*.js`)
    .pipe($.plumber({ errorHandler: errorMessage }))
    .pipe($.concat('app.js'))
    .pipe($.uglify())
    .pipe(gulp.dest(routes.dist.scripts))
    .pipe(browserSync.reload({ stream: true }))

  done()
})

gulp.task('images', done => {
  gulp
    .src(`${routes.src.img}/**/*.*`)
    .pipe($.plumber({ errorHandler: errorMessage }))
    .pipe(
      $.imagemin([
        $.imagemin.gifsicle({ interlaced: true }),
        $.imagemin.jpegtran({ progressive: true }),
        $.imagemin.optipng({ optimizationLevel: 5 }),
        $.imagemin.svgo({
          plugins: [{ removeViewBox: true }]
        })
      ])
    )
    .pipe(gulp.dest(routes.dist.img))
    .pipe(browserSync.reload({ stream: true }))

  done()
})

gulp.task('server', done => {
  browserSync.init({
    notify: false,
    open: false,
    server: {
      baseDir: routes.dist
    }
  })

  done()
})

gulp.task('clean', done => {
  sync(routes.dist.views)
  done()
})

gulp.task('watch', () => {
  gulp.watch(`${routes.watch.views}`, gulp.series('views'))
  gulp.watch(`${routes.watch.styles}`, gulp.series('styles'))
  gulp.watch(`${routes.watch.scripts}`, gulp.series('scripts'))
})

exports.dev = gulp.series('clean', tasks.dev)
exports.build = gulp.series('clean', tasks.build)
