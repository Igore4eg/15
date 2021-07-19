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
const uglify = require('gulp-uglify');

const { src, dest, parallel, series, watch } = gulp;

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

function serve(){
    browserSync.init({
        server: 'src',
        notify: false,
        online: true
    });
    browserSync.watch('src/**/*.*').on('change', browserSync.reload);
}

function compress(){
    return src('src/*.js')
        .pipe(uglify())
        .pipe(dest('docs/'))
}

function styles(){
    return src('src/styles/main.sass')
        .pipe(gulpif(isDev, sourcemaps.init()))
        .pipe(sass()) 
        .pipe(debug({title: 'sass'}))
        .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) 
        .pipe(cleancss( { level: { 1: { specialComments: 0 } } } ))
        .pipe(gulpif(isDev, sourcemaps.write()))
        .pipe(debug({title: 'sourcemap'}))
        .pipe(dest('docs/styles/')) 
        .pipe(browserSync.stream())
    }

function images(){
    return src('src/img/**/*') 
		.pipe(newer('docs/img/'))
		.pipe(imagemin()) 
		.pipe(dest('docs/img/'))
}

function imgaeMin(){
    return src('src/img/**/*') 
        .pipe(imagemin())
        .pipe(dest('docs/img/')) 
}

exports.images = images;
exports.imgaeMin = imgaeMin;
exports.serve = serve;
exports.styles = styles;
exports.compress = compress;
