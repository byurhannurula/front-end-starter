module.exports = {
  paths: {
    src: {
      views: `./src/views`,
      styles: `./src/styles`,
      scripts: `./src/scripts`,
      fonts: `./src/fonts`,
      img: `./src/images`
    },
    dist: {
      views: `./build`,
      styles: `./build/css`,
      scripts: `./build/scripts`,
      fonts: `./build/fonts`,
      img: `./build/images`
    },
    watch: {
      views: `./src/views/**/*.+(html|tpl)`,
      styles: `./src/styles/**/*.scss`,
      scripts: `./src/scripts/**/*.js`
    }
  },
  tasks: {
    dev: [
      `compileViews`,
      `compileStyles`,
      `compileScripts`,
      `optimizeImages`,
      `startServer`,
      `watchFiles`
    ],
    build: [`compileViews`, `compileStyles`, `compileScripts`, `optimizeImages`]
  }
}
