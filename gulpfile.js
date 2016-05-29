'use strict';

const gulp = require('gulp');
const notify = require('gulp-notify');
const growl = require('gulp-notify-growl');
const jscs = require('gulp-jscs');
const jshint = require('gulp-jshint');
const changed = require('gulp-changed');
const sass = require('gulp-sass');
const uglify = require('gulp-uglifyjs');
const del = require('del');
const tsc = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = tsc.createProject('client/src/tsconfig.json');
const tslint = require('gulp-tslint');

gulp.task('jshint', function() {
	const lib = gulp.src('lib/**/*.js').pipe(changed('lib/*.js')).pipe(jshint()).pipe(jshint.reporter('jshint-stylish'));
	const routes = gulp.src('api/*.js').pipe(changed('routes/*.js')).pipe(jshint()).pipe(jshint.reporter('jshint-stylish'));
	const test = gulp.src('test/*.js').pipe(changed('test/*.js')).pipe(jshint()).pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', ['clean-frontend'], function() {
	return gulp.src('./client/src/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./client/public'));
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

gulp.task('clean-frontend', function(cb) {
	return del(['client/public/**', '!client/public'], cb);
});

gulp.task('transpile-prod-frontend', ['clean-frontend'], function() {
	/* Avoid: 'error TS2304: Cannot find name <type>' during compilation by getting browser.d.ts as src */
	var tsResult = gulp.src(['client/src/typings/browser.d.ts', 'client/src/app/**/*.ts'])
		.pipe(tsc(tsProject));
	return tsResult.js
		.pipe(gulp.dest('client/public/app'));
});

gulp.task('transpile-dev-frontend', ['clean-frontend'], function() {
	/* Avoid: 'error TS2304: Cannot find name <type>' during compilation by getting browser.d.ts as src */
	var tsResult = gulp.src(['client/src/typings/browser.d.ts', 'client/src/app/**/*.ts'])
		.pipe(sourcemaps.init())
		.pipe(tsc(tsProject));
	return tsResult.js
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('client/public/app'));
});

gulp.task('copy-frontend', ['clean-frontend'], function() {
	return gulp.src(['client/src/app/**/*', 'client/src/index.html', 'client/src/systemjs.config.js', '!**/*.ts'], {base: 'client/src'})
		.pipe(gulp.dest('client/public'));
});

gulp.task('libs-frontend', ['clean-frontend'], function() {
	return gulp.src([
            'es6-shim/es6-shim.min.js',
            'systemjs/dist/system-polyfills.js',
            'systemjs/dist/system.src.js',
            'reflect-metadata/Reflect.js',
			'core-js/**',
            'rxjs/**',
            'zone.js/dist/**',
            '@angular/**',
			'@angular2-material/**',
        ], {cwd: "client/src/node_modules/**"})
        .pipe(gulp.dest("client/public/node_modules"));
});

gulp.task('build-frontend', ['clean-frontend', 'transpile-prod-frontend', 'copy-frontend', 'libs-frontend', 'sass']);

gulp.task('build-dev-frontend', ['clean-frontend', 'transpile-dev-frontend', 'copy-frontend', 'libs-frontend', 'sass']);

gulp.task('default', ['jshint', 'concat', 'build-frontend']);
