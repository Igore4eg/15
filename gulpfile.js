`use strict`;

const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const cleancss = require('gulp-clean-css');
const debug = require('gulp-debug');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const sass = require('gulp-sass');
const svgSprite = require('gulp-svg-sprite');
const sourcemaps = require('gulp-sourcemaps');

const { src, dest, parallel, series, watch } = gulp;

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

function startwatch  () {
	gulp.watch('src/styles/*.sass', gulp.series('styles'));
	gulp.watch('src/**/*.html').on('change', browserSync.reload);
};

function serve(){
    browserSync.init({
        server: 'source',
        notify: false,
        online: true
    });
}

function styles(){
    return src('src/sass/main.scss')
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(sass()) 
        .pipe(debug({title: 'sass'}))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) 
        .pipe(cleancss( { level: { 1: { specialComments: 0 } } } ))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(debug({title: 'sourcemap'}))
        .pipe(dest('build/styles/')) 
        .pipe(browserSync.stream())
    }

function images(){
    return src('src/img/**/*') 
		.pipe(newer('build/img/'))
		.pipe(imagemin()) 
		.pipe(dest('build/img/'))
}

function imgaeMin(){
    return src('src/img/**/*') 
        .pipe(imagemin())
        .pipe(dest('build/img/')) 
}

exports.images = images;
exports.imgaeMin = imgaeMin;
exports.startwatch = startwatch;
exports.serve = serve;
exports.styles = styles;
