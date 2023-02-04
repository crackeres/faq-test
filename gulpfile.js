let preprocessor = "sass";

const { src, dest, parallel, series, watch } = require("gulp");
const browserSync = require("browser-sync").create();
const bssi = require("browsersync-ssi");
const buildssi = require("gulp-ssi");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const webpack = require("webpack-stream");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const rename = require("gulp-rename");
const del = require("del");

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
      middleware: bssi({ baseDir: "app/", ext: ".html" }),
    },
    ghostMode: { clicks: false },
    notify: false,
    online: true,
  });
}

function scripts() {
  return src(["./app/js/index.js", "!./app/js/all.min.js"])
    .pipe(
      webpack({
        mode: "development",
        performance: { hints: false },
        devtool: "eval-source-map",
        module: {
          rules: [
            {
              test: /\.(js)$/,
              exclude: /(node_modules)/,
              loader: "babel-loader",
              query: {
                presets: ["@babel/env"],
                plugins: ["babel-plugin-root-import"],
              },
            },
          ],
        },
      })
    )
    .on("error", function handleError() {
      this.emit("end");
    })
    .pipe(rename("all.min.js"))
    .pipe(dest("./app/js"))
    .pipe(browserSync.stream());
}

function styles() {
  return src("./app/scss/index.scss")
    .pipe(eval(preprocessor)())
    .pipe(concat("style.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["> 1%", "last 2 versions", "not ie <= 8"],
        grid: true,
      })
    )
    .pipe(
      cleancss({
        level: { 1: { specialComments: 0 } } /* , format: 'beautify' */,
      })
    )
    .pipe(dest("./app/css"))
    .pipe(browserSync.stream());
}

function startwatch() {
  watch(["app/js/**/*.js", "!app/js/**/*.min.js"], scripts);
  watch("app/scss/**/*", styles);
  watch("app/**/*.html").on("change", browserSync.reload);
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;

exports.default = parallel(scripts, styles, browsersync, startwatch);
