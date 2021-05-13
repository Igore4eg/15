`use strict`;

const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const sass = require('gulp-sass');


gulp.task('sass', function () {
    return gulp.src('./source/sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./css'));
});
   
gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('serve', function(){
    browserSync.init({
        server: 'public'
    });
    browserSync.watch('public/**/*.*').on('change', browserSync.reload);
})