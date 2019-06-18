const gulp = require('gulp');
const babel = require('gulp-babel');
const react = require('gulp-react');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const cp = require('child_process');


gulp.task('react', () => {
  return gulp
    .src(["interface/**/*.jsx"])
    .pipe(gulp.dest('./interface'))
    .pipe(plumber())
    .pipe(react())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('interface/'));
});

gulp.task('default', () => {
  gulp.start(['react']);
  watch(["interface/**/*.jsx"], () => gulp.start(['react']));
});