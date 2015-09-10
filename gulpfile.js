var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	gutil = require('gulp-util'),
	webserver = require('gulp-webserver'),
	compass = require('gulp-compass'),
	autoprefixer = require('gulp-autoprefixer'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyHTML = require('gulp-minify-html'),
	sourcemaps = require('gulp-sourcemaps'),
	merge = require('merge2'),
	debug = require('gulp-debug'),
	tsProject = ts.createProject('tsconfig.json', { sortOutput: true });

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
htmlSources = [outputDir + '*.html', outputDir + 'views/**/*.html'];
typescriptSources = ['components/typescript/**/**/*.ts', ];

/**
 * connect
 */
gulp.task('connect', function () {
	// connect.server({
	// 	root: outputDir,
	// 	https: true,
	// 	livereload: true
	// });
	gulp.src(outputDir)
		.pipe(webserver({
			port: 8080,
			https: {pfx: 'ssl/ServerSSL.pfx', passphrase: 'Test123'},
			livereload: true,
			directoryListing: false,
			open: false			
		}));
});
/**
 * html (Reload index.html)
 */
gulp.task('html', function () {
  gulp.src(['builds/development/*.html', 'builds/development/**/**/*.html'])
		.pipe(gulpif(env === 'production', minifyHTML()))
		.pipe(gulpif(env === 'production', gulp.dest(outputDir)));
});
/**
 * typescript
 */
function tsc(src, dest, out) {
  var tsResult = gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(ts({
      noImplicitAny: true,
      target: 'es5',
      declarationFiles: false,
      out: out,
      noExternalResolve: false
    }));

  var js = tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dest));

  var dts = tsResult.dts
    .pipe(gulp.dest(dest));

  return merge([js, dts]);
}
gulp.task('typescript', function () {
	return tsc(typescriptSources, outputDir + 'js', 'tsoutput.js')
    .pipe(debug({ title: 'scripts:' }));
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
		.pipe(autoprefixer({browsers: ['last 2 versions', '> 5%']}))
		.pipe(gulp.dest(outputDir + 'css'));
});
 
/**
 * watch
 */
gulp.task('watch', function () {
  gulp.watch(['builds/development/*.html', 'builds/development/**/**/*.html'], ['html']);
	gulp.watch(typescriptSources, ['typescript']);
	gulp.watch(sassSources, ['sass']);
});
/**
 * default
 */
gulp.task('default', ['typescript', 'sass', 'html', 'connect', 'watch']);