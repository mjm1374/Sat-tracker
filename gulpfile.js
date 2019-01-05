var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;

gulp.task('sass', function () {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest('css'));
});

gulp.task('js', function () {
    return gulp.src(['js/common.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('javascript'));
});

gulp.task('watch', function () {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('js/*.js', ['js']);
});

gulp.task('default', ['sass', 'js', 'watch']);