const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const imagemin = require("gulp-imagemin");
const gulpWebp = require("gulp-webp");
const rename = require("gulp-rename");
const svgstore = require("gulp-svgstore");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const csso = require("gulp-csso");
const sync = require("browser-sync").create();
const del = require("del");
const terser = require("gulp-terser");

// Preprocessor

const styles = () => {
  return gulp
    .src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

const reload = (done) => {
  sync.reload();
  done();
};

const scripts = () => {
  return gulp.src("source/js/script.js")
    .pipe(terser())
    .pipe(rename({
      suffix: `.min`
    }))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
};

exports.scripts = scripts;

const html = () => {

};

exports.html = html;

// Watcher

const watcher = () => {
  gulp.watch(`source/less/**/*.less`, gulp.series(styles, reload));
  gulp.watch(`source/*.html`, gulp.series(copy, reload));
  gulp.watch(`source/js/script.js`, gulp.series(scripts, reload));
};

exports.default = gulp.series(
  styles, server, watcher
);

// Image

const images = () => {
  return gulp
    .src("source/img/**/*.{jpg,png,svg}")
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.svgo(),
      ])
    );
};

exports.images = images;

// Webp

const webp = () => {
  return gulp
    .src("source/img/**/*.{jpg,png}")
    .pipe(gulpWebp({ quality: 90 }))
    .pipe(gulp.dest("build/img"));
};

exports.webp = webp;

// Svg-sprites

const sprite = () => {
  return gulp
    .src("source/img/**/icon-*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
};

exports.sprite = sprite;

// Copy

const copy = () => {
  return gulp
    .src(
      [
        "source/fonts/**/*.{woff,woff2}",
        "source/img/**",
        "source/*.ico",
        "source/*.html",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
};

exports.copy = copy;

// Del

const clean = () => {
  return del("build");
};

exports.clean = clean;

const build = (done) => gulp.series (
  clean,
  copy,
  styles,
  scripts,
  // html,
)(done);

exports.build = build;

const start = () => gulp.series (
  build,
  server,
  watcher
)();

exports.start = start;
