var gulp = require('gulp');
// Images
// var imagemin = require('gulp-imagemin');
// var jpegoptim = require('imagemin-jpegoptim');
// var optipng = require('imagemin-optipng');
// Styles
var autoprefixer = require('gulp-autoprefixer');
var less = require('gulp-less');
// var sourcemaps = require('gulp-sourcemaps');
var cssmin = require('gulp-cssmin');
// Scripts
var uglify = require('gulp-uglify');
// Other
var concat = require('gulp-concat');
var notify = require('gulp-notify');

var js_files = [
	'resources/assets/bower/jquery/dist/jquery.min.js',
	'resources/assets/bower/bootstrap/dist/js/bootstrap.min.js',
	'resources/assets/bower/pickmeup/js/jquery.pickmeup.min.js',
	'resources/assets/bower/moment/min/moment.min.js',
	'resources/assets/bower/bootstrap-sortable/Scripts/bootstrap-sortable.js',
	'resources/assets/bower/bootbox.js/bootbox.js',
	'resources/assets/scripts/scripts.js',
	'resources/assets/scripts/login.js'
];

var css_files = [
	'resources/assets/bower/font-awesome/css/font-awesome.min.css',
	'resources/assets/bower/lato/css/lato.min.css',
	'resources/assets/bower/bootstrap/dist/css/bootstrap.css',
	'resources/assets/bower/pickmeup/css/pickmeup.css',
	'resources/assets/bower/bootstrap-sortable/Contents/bootstrap-sortable.css',
	'resources/assets/styles/balloon.min.css',
	'resources/assets/styles/styles.less'
];

var img_files = 'resources/assets/images/**/*';

gulp.task('js', function () {
	return gulp.src(js_files)
		.pipe(uglify()).pipe(concat('js.js'))
		.pipe(gulp.dest('public/js'))
		.pipe(notify('JS: done'));
});

gulp.task('css', function() {
	return gulp.src(css_files)
		.pipe(less({compress: true}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(cssmin())
		.pipe(concat('css.css'))
		.pipe(gulp.dest('public/css'))
		.pipe(notify('CSS: done'));
});

// gulp.task('img', function() {
// 	return gulp.src(img_files)
// 		.pipe(imagemin({
// 			progressive: true,
// 			optimizationLevel: 3
// 		}))
// 		.pipe(jpegoptim({ progressive: true })())
// 		.pipe(optipng({ optimizationLevel: 3 })())
// 		.pipe(gulp.dest('public/img'));
// });

gulp.task('fonts', function() {
	gulp.src(['resources/assets/bower/lato/font/**/*']).pipe(gulp.dest('public/font'));
	gulp.src(['resources/assets/bower/font-awesome/fonts/*']).pipe(gulp.dest('public/fonts'));
});

gulp.task('watch', function() {
	// gulp.watch(img_files, ['img']);
	gulp.watch(js_files, ['js']);
	gulp.watch(css_files, ['css']);
});

gulp.task('default', function() {
	gulp.start('css', 'js');
	// gulp.watch(img_files, ['img']);
	gulp.watch(js_files, ['js']);
	gulp.watch(css_files, ['css']);
});