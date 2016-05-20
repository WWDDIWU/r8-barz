'use strict';

const gulp = require('gulp');
const notify = require('gulp-notify');
const growl = require('gulp-notify-growl');
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');
const changed = require('gulp-changed');
const sass = require('gulp-sass');
const uglify = require('gulp-uglifyjs');

gulp.task('jshint', function() {
	const lib = gulp.src('lib/**/*.js').pipe(changed('lib/*.js')).pipe(jshint()).pipe(jshint.reporter('jshint-stylish'));
	const routes = gulp.src('api/*.js').pipe(changed('routes/*.js')).pipe(jshint()).pipe(jshint.reporter('jshint-stylish'));
	const test = gulp.src('test/*.js').pipe(changed('test/*.js')).pipe(jshint()).pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function() {
	return gulp.src('./client/src/sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./client/public/css'));
});

gulp.task('sass:watch', function() {
	gulp.watch('./client/src/sass/*.scss', ['sass']);
});

gulp.task('concat', function() {
	gulp.src('client/src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('client/public/js'));
});

gulp.task('concat:watch', function() {
    gulp.watch('./client/src/js/*.js', ['concat']);
});

gulp.task('default', ['jshint', 'concat', 'sass']);
