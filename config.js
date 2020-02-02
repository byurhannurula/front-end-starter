module.exports = {
  routes: {
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
      views: `./src/views/**/*.+(html|pug)`,
      styles: `./src/styles/**/*.scss`,
      scripts: `./src/scripts/**/*.js`
    }
  },
  tasks: {
    dev: [`views`, `styles`, `scripts`, `images`, `server`, `watch`],
    build: [`views`, `styles`, `scripts`, `images`]
  }
}
