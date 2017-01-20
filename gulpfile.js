// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	//bless = require('gulp-bless'),
	//gutil = require('gulp-util'),
	rename = require('gulp-rename'),
	babel = require('gulp-babel');





// Lint Task
gulp.task('lint', function() {
	return gulp.src('js/theme/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});



// Compile Our Sass
gulp.task('sass-menu-left', function() {
	return gulp.src('menu-left/css/style.scss')
		.pipe(sass())
		.pipe(gulp.dest('menu-left/dist/css'))
		.pipe(rename('style.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('menu-left/dist/css'));
});

// Split our CSS for IE selector limits.
gulp.task('bless', function() {
	gulp.src('dist/css/style.css')
		.pipe(rename('style-ie.css'))
		.pipe(bless({
			imports:false,
			suffix: '-'
		}))
		.pipe(gulp.dest('dist/css'));
});

/*
Minify everything. This is separate because bless gets buggy when using minified files 
as the source. The developer recommends running bless BEFORE files are minified.

The bless package numbers the files backwards, with "style-02" being the first file.
This task corrects for that with new numbering. It must run as a separate task after 
the bless task, but may be combined as shown in the "split" task below. After testing, 
"bless" and "bless-min" can be placed in the default task with everything else. However, 
these must run after the "sass" task.
*/
gulp.task('min', function() {
	gulp.src('dist/css/style.css')
		.pipe(rename('style.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'));

	gulp.src('dist/css/style-ie-2.css')
		.pipe(rename('style-ie-2.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'));

	gulp.src('dist/css/style-ie-1.css')
		.pipe(rename('style-ie-1.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'));

	gulp.src('dist/css/style-ie.css')
		.pipe(rename('style-ie.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'));
});


// Watch Files For Changes
gulp.task('watch', function() {
	//gulp.watch('js/theme/*.js', ['lint', 'scripts']);
	gulp.watch('js/theme/*.js', ['scripts-deferred']);
	gulp.watch('css/theme/_partials/*.scss', ['sass']);
	gulp.watch('css/theme/vars.scss', ['sass']);
	gulp.watch('css/theme/style.scss', ['sass']);
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
gulp.task('default', ['sass', 'scripts-deferred', 'watch']);




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


































/*
JavaScript module tree, to show dependencies.

- AE.js
	- AE.account.js
	- AE.booking.js
		- AE.booking.savequote.js
		- AE.booking.terms.js
		- AE.booking.matrix.js
			- AE.booking.matrix.results.js
		- AE.booking.optequip.js
	- AE.cookie.js
	- AE.forms.js
	- AE.tracking.dimensions.js
	- AE.tracking.ga.js
	- AE.init.js
	- AE.legacy.js
	- AE.maps.js
	- AE.mura.js
	- AE.nav.js
	- AE.newsletter.js
	- AE.template.js
	- AE.ui.js
		- AE.ui.datepicker.js
		- AE.ui.tabcordion.js
		- AE.ui.dialog.js
		- AE.ui.modify.js
		- AE.ui.autocomplete.js
		- AE.ui.selectmenu.js
	- AE.utils.js



=====================
Setting up Gulp
=====================


There are two files that will be version controlled for Gulp. They are: 
package.json	: A general description of this project. It must be present, but we can update as needed. 
gulpfile.js		: This file that you're reading! It has all the instructions for what Gulp is going to do for us.


To get started, Node must be installed. There's an installer on the official site.
https://nodejs.org/en/


Here's an excellent article that will walk you through setting up Gulp:
https://travismaynard.com/writing/getting-started-with-gulp


There's a "gotcha" in that article, however. The "gulp-jshint" plugin has a dependence of "jshint". So the big install 
command that Travis Maynard's article gives you needs to include "jshint" in front of "gulp-jshint". It also needs to 
include a way to minify the CSS since the gulp-uglify plugin only handles JavaScript. Here's the completed command: 

npm install jshint gulp-jshint gulp-sass gulp-concat gulp-uglify clean-css gulp-clean-css gulp-rename gulp-livereload --save-dev

Here's an explanation on why that is:
https://github.com/olefredrik/FoundationPress/issues/664


Just in case you need it, I've also written my own blog post on how I set up Gulp. It mostly just goes over the stuff 
written above, but here's the url:
http://www.themightycribb.com/how-i-got-started-with-gulp/

=====================
Watching Files: 
=====================
If you include the 'watch' task, then Gulp will keep running in the terminal. When a file in a watched folder gets 
saved, the 'watch' task will run. This will keep running until you enter Control+C to stop it. If you don't want to 
run it that way, then you could just type "gulp" when you want to update the files. We've defined a default task, so 
we don't have to name it. (Although we could enter "gulp default" if we want to.)



* Probably don't need this part, but just in case: *
=======================================================================================================================
I didn't have any permission problems, but if you do then this might help: 
https://docs.npmjs.com/getting-started/fixing-npm-permissions

But it also leaves something out. The video expects you to edit a text file in the terminal but doesn't say what 
keyboard commands were needed to get this done. Here's a reference for that: 
http://stackoverflow.com/questions/37365179/open-a-file-in-editor-and-then-save-it-back-by-terminal-on-bash
*/