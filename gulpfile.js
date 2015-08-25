var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	gutil = require('gulp-util'),
	connect = require('gulp-connect'),
	compass = require('gulp-compass'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	tsProject = ts.createProject('tsconfig.json');

var env,
		sassSources,
		htmlSources,
		typescriptSources,
		sassStyle,
		outputDir;

env = process.env.NODE_ENV || 'development';

if (env === 'development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';	
}

sassSources = ['components/sass/**/*.scss'];
htmlSources = [outputDir + '*.html',outputDir + 'views/**/*.html'];
typescriptSources = ['components/typescript/**/**/*.ts'];

/**
 * connect
 */
gulp.task('connect', function () {
	connect.server({
		root: outputDir,
		livereload: true
	});
});
/**
 * html (Reload index.html)
 */
gulp.task('html', function () {
  gulp.src(htmlSources)
    .pipe(connect.reload());
});
/**
 * typescript
 */
gulp.task('typescript', function () {
	var tsResult = tsProject.src().pipe(ts(tsProject));
	return tsResult.js
						.pipe(gulpif(env === 'production', uglify()))
						.pipe(gulp.dest(outputDir + 'js'))						
						.pipe(connect.reload());
});
/**
 * sass
 */
gulp.task('sass', function () {
  gulp.src(sassSources)
    .pipe(compass({
			css: outputDir + 'css',
			sass: 'components/sass',
			image: outputDir + 'images',
			style: sassStyle
		}))
		.on('error', gutil.log)
		.pipe(gulp.dest(outputDir + 'css'))
		.pipe(connect.reload());
});
 
/**
 * watch
 */
gulp.task('watch', function () {
  gulp.watch(htmlSources, ['html']);  // html files for livereload
	gulp.watch(typescriptSources, ['typescript']); // typescript files for compilation
	gulp.watch(sassSources, ['sass']); // sass files for compilation
});
/**
 * default
 */
gulp.task('default', ['typescript', 'sass', 'connect', 'watch']);