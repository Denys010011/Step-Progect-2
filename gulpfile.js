const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify");
const minifyjs = require("gulp-js-minify");
const cleanCSS = require("gulp-clean-css");
const clean = require("gulp-clean");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const autoprefixer = require("gulp-autoprefixer");

function html(done) {
  gulp.src("index.html").pipe(gulp.dest("dist")).on("end", done);
}

const path = {
  src: {
    scss: "./src/scss/**/*.scss",
    js: "./src/js/*.js",
    img: "./src/image/**/*",
  },
  dist: {
    html: "dist",
    self: "dist/",
    css: "./dist/css/",
    js: "./dist/js/",
    img: "./dist/image/",
  },
};

const distScss = () => {
  gulp
    .src(path.src.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(path.dist.css));
};
const buildScss = () =>
  gulp
    .src(path.src.scss)
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("styles.min.css"))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.stream());

const buildJs = () =>
  gulp
    .src(path.src.js)
    .pipe(concat("scripts.min.js"))
    .pipe(uglify())
    .pipe(minifyjs())
    .pipe(gulp.dest(path.dist.js))
    .pipe(browserSync.stream());

const buildImg = () =>
  gulp.src(path.src.img).pipe(imagemin()).pipe(gulp.dest(path.dist.img));

const watcher = () => {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    browser: "chrome",
    notify: false,
  });

  gulp.watch("./index.html").on("change", browserSync.reload);
  gulp.watch(path.src.scss, buildScss).on("change", browserSync.reload);
  gulp.watch(path.src.js, buildJs).on("change", browserSync.reload);
  gulp.watch(path.src.img, buildImg).on("change", browserSync.reload);
};

// const cleanDist = () => (
//     gulp.src('dist', {read: false})
//         .pipe(clean())
// );

gulp.task("dev", gulp.series(watcher));
gulp.task("build", gulp.parallel(html, buildImg, buildScss, buildJs));
