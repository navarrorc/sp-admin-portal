var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	gutil = require('gulp-util'),
	connect = require('gulp-connect'),
	compass = require('gulp-compass'),
	tsProject = ts.createProject('tsconfig.json');

var sassSources = ['components/sass/style.scss'];

/**
 * connect
 */
gulp.task('connect', function () {
	connect.server({
		root: 'builds/development',
		livereload: true
	});
});
/**
 * html (Reload index.html)
 */
gulp.task('html', function () {
  gulp
		.src('builds/development/*.html')
    .pipe(connect.reload());
});
/**
 * typescript
 */
gulp.task('typescript', function () {
	var tsResult = tsProject.src().pipe(ts(tsProject));
	return tsResult.js
						.pipe(gulp.dest('builds/development/js'))
						.pipe(connect.reload());
});
/**
 * sass
 */
gulp.task('sass', function () {
  gulp
		.src(sassSources)
    .pipe(compass({
			css: 'builds/development/css',
			sass: 'components/sass',
			image: 'builds/development/images',
			style: 'expanded'
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest('builds/development/css'))
		.pipe(connect.reload());
});
 
/**
 * watch
 */
gulp.task('watch', function () {
  gulp.watch(['builds/development/*.html', 'builds/development/views/**/*.html'], ['html']);  // html files for livereload
	gulp.watch(['components/typescript/**/**/*.ts'], ['typescript']); // typescript files for compilation
	gulp.watch(['components/sass/style.scss'], ['sass']); // sass files for compilation
});
/**
 * default
 */
gulp.task('default', ['typescript', 'sass', 'connect', 'watch']);