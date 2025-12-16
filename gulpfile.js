const gulp = require('gulp');
const sass = require('gulp-dart-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const paths = {
  scss: 'src/scss/**/*.scss',
  cssOut: 'assets'
};

function buildScss() {
  return gulp
    .src('src/scss/featured-products.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.cssOut));
}

function watch() {
  gulp.watch(paths.scss, buildScss);
}

exports.build = buildScss;
exports.watch = watch;