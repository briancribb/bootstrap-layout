// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	//gutil = require('gulp-util'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel');



/*
Terminal command should include the target folder. Here's an example using menu-left:
gulp myTask --option menu-left

The "--option" needs to be there so Gulp knows that we're passing arguments instead of 
task names. The value needs to appear after "--option", but otherwise it doesn't matter 
how many arguments we're passing.

The function finds the index of "--option" in the arguments array and returns the value 
after that.
*/
function getOptionIndex(args) {
	var flag = args.indexOf("--option");
	return args[flag+1] + '/';
}


// Lint Task
gulp.task('lint', function() {
	return gulp.src('js/theme/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});




// Compile Our Sass
gulp.task('sass', function() {
	console.log('sass: ' + getOptionIndex(process.argv) );
	var strFolder = getOptionIndex(process.argv);

	gulp.src([
			strFolder+'css/style.scss'
		])
		.pipe(sass())
		.pipe(gulp.dest(strFolder+'dist/css'))
		.pipe(rename('style.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest(strFolder+'dist/css'));

});

// Concatenate & Minify JS
gulp.task('scripts', function() {
	console.log('scripts: ' + getOptionIndex(process.argv) );
	var strFolder = getOptionIndex(process.argv);

	return gulp
		.src([
			//'vendor/tether-1.3.3/dist/js/tether.min.js',
			'vendor/tether-1.3.3/dist/js/tether.min.js',
			'vendor/ie10/ie10-viewport-bug-workaround.js',
			strFolder+'js/custom.js'
		])
		.pipe(concat('all.js'))
		.pipe(gulp.dest(strFolder+'dist/js'))
		.pipe(rename('all.min.js'))
		.pipe(uglify())
		//.pipe(uglify().on('error', gutil.log))
		.pipe(gulp.dest(strFolder+'dist/js'));
});



// Watch Files For Changes
gulp.task('watch', function() {
	console.log('watch: ' + getOptionIndex(process.argv) );
	var strFolder = getOptionIndex(process.argv);
	//gulp.watch(strFolder+'js/theme/*.js', ['lint', 'scripts']);
	gulp.watch(strFolder+'js/*.js', ['scripts']);
	gulp.watch(strFolder+'css/_partials/*.scss', ['sass']);
	gulp.watch(strFolder+'css/_custom.scss', ['sass']);
	gulp.watch(strFolder+'css/style.scss', ['sass']);
});


/*
Below is our default task. This runs when you just type "gulp" into the terminal.

After this, enter 'gulp bless-min' to minify the blessed files. This is necessary because 
there's no way (currently) to use the output of one task in the next task. Meaning that 
the CSS files for bless don't exist until the task runs, so the minification task won't be 
able to use them.

Even if the file already exists, Gulp can't be trusted to wait until they're updated. So we 
will minify the split CSS separately for now.

Example of what you need to type into the terminal if you have bless installed:
gulp		- Compile Sass, concatenate and minify JS, watch files and folders.
gulp bless	- Split main CSS file by selector count because IE is terrible.
gulp min	- Minify all CSS files, including the main one and the split files for IE.

Just run the first line while you're working, and then run the other two in order before 
you commit.
*/

// Use this if you haven't installed bless yet.
gulp.task('default', ['sass', 'scripts', 'watch']);
//gulp.task('layout', ['sass', 'scripts', 'watch']);



/*
UTILITY PACKAGE in case you have a typo in a file and it blows up the world.

Gulp will concatenate the JavaScript files just fine, but will read through them as it tries 
to minify everything. This is where the errors pop up, and they'll be useless because they 
tell you about things in the node_modules folder instead of tipping you off to which of your 
files caused the problem.

When you need to identify the point where everything broke, you need to use the gulp-util 
package: https://www.npmjs.com/package/gulp-util

This will give you additional error information, including a line number. To use it, do the 
following:
1.	Uncomment this line:
	gutil = require('gulp-util'),

2.	Comment out the other line with "uglify" and uncomment this one: 
	.pipe(uglify().on('error', gutil.log))

If you don't have this package installed, make sure that you're in the AE1 directory where 
this file lives and type this into the terminal to install the package locally:
npm install gulp-bless --save-dev

GOTCHA:
The line 
Gulp is trying to build the "AE.min.js" file, so that's the name it will display in the error.
However, the line number displayed is from the "AE.js" file that it just concatenated and saved. 
That's good news, because you can just scroll to that line in "AE.js" and find out which source 
file caused the problem.
*/
