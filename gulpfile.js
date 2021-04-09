const sync = require("browser-sync").create();

const gulp = require("gulp");
const del = require("del");
const autoprefixer = require("autoprefixer");

const sass = require("gulp-sass");
const svgstore = require("gulp-svgstore");
const rename = require("gulp-rename");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const csso = require("gulp-csso");
const imagemin = require("gulp-imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminSvgo = require("imagemin-svgo");
const gulpWebp = require("gulp-webp");
const terser = require("gulp-terser");

// Запускаем сервер: показываем файлы из папки build, со включённым CORS,
// без интерфейса настройки и уведомлений о перезапуске

const server = (done) => {
  sync.init({
    server: {
      baseDir: `build`,
    },
    open: true,
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

// Перезапускаем сервер

const reload = (done) => {
  sync.reload();
  done();
};

// Отслеживаем изменения файлов в разных папаках, вфполняем задачи
// и перезапускаем сервер

const watcher = () => {
  gulp.watch(`source/sass/**/*.scss`, gulp.series(style, reload));
  gulp.watch(`source/*.html`, gulp.series(copy, html, reload));
  gulp.watch(`source/js/script.js`, gulp.series(scripts, reload));
};

// Удаляем файлы из папки build

const clean = () => {
  return del(`build`);
};

// Копируем некоторые файлы из папки source в папку build:
// шрифты, картинки, иконки и HTML

const copy = () => {
  return gulp
    .src(
      [
        `source/fonts/**/*.{woff,woff2}`,
        `source/img/**`,
        `source/*.ico`,
        `source/*.html`,
      ],
      {
        base: `source`,
      }
    )
    .pipe(gulp.dest(`build`));
};

// Обрабатываем код на SASS: составляем карту кода, превращаем его в единый CSS,
// добавляем префиксы, сжимаем, добавляем суффикс min и записываем в папку build/css

const style = () => {
  return gulp
    .src(`source/sass/style.scss`)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    // .pipe(postcss([autoprefixer()]))
    // .pipe(csso())
    .pipe(
      rename({
        suffix: `.min`,
      })
    )
    .pipe(sourcemap.write(`.`))
    .pipe(gulp.dest(`build/css`))
    .pipe(sync.stream());
};

// Обрабатываем код на JS: сжимаем,
// добавляем суффикс min и записываем в папку build/js

const scripts = () => {
  return gulp
    .src("source/js/script.js")
    .pipe(terser())
    .pipe(
      rename({
        suffix: `.min`,
      })
    )
    .pipe(gulp.dest(`build/js`))
    .pipe(sync.stream());
};

// Создаём единый файл — спрайт — из всех SVG-иконок: склеиваем файлы,
// имена которых начинаются на icon, и записываем в папку build/css

const sprite = () => {
  return gulp
    .src(`source/img/**/icon-*.svg`)
    .pipe(svgstore())
    .pipe(rename(`sprite.svg`))
    .pipe(gulp.dest(`build/img`));
};

exports.sprite = sprite;

// Обрабатываем код на HTML

const html = () => {
  return gulp
    .src(`source/*.html`)
    .pipe(posthtml([include()]))
    .pipe(gulp.dest(`build`));
};

exports.html = html;

// Обрабатываем изображения: над всеми PNG делаем 7 прогонов оптимизации,
// все JPG наделяем прогрессивным методом, все SVG чистим, оставляя ViewBox

const images = () => {
  return gulp
    .src(`source/img/**/*.{png,jpg,svg}`)
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 7 }),
        imageminJpegtran({ progressive: true }),
        imageminSvgo({
          plugins: [{ removeViewBox: false }],
        }),
      ])
    )
    .pipe(gulp.dest(`source/img`));
};

exports.images = images;

// Обрабатываем изображения: все картинки пытаемся сжать до 90% качества
// и конвертируем в формат WEBP

const webp = () => {
  return gulp
    .src(`source/img/**/*.{png,jpg}`)
    .pipe(gulpWebp({ quality: 90 }))
    .pipe(gulp.dest(`source/img`));
};

exports.webp = webp;

// Собираем проект: удаляем папку build, копируем файлы, обрабатываем стили
// сжимаем скрипты и обрабатываем HTML

const build = (done) =>
  gulp.series(
    clean,
    copy,
    style,
    scripts
    // html,
  )(done);

exports.build = build;

// Запускаем проект: собираем файлы, стартуем сервер
// и отслеживаем изменения в файлах

const start = () => gulp.series(build, server, watcher)();

exports.start = start;
