;var SITE = SITE || (function(){
	var APP = {
		resizeTasks : [],
		init : function() {
			APP.props = {
				$bodyElement		: $('body'),
				$topBar				: $('#topbar'),
				$mainNav			: $('#mainnav'),
				$mainNavList		: $('#mainnav > ul'),
				$mainFooter			: $('#main-footer'),
				$mainFooterContent	: $('#main-footer-content'),
				$mainNavToggle		: $( '#topbar .toggle')
			};



			APP.addResizeTask({
				func: function() {

					var topBarHeight = APP.props.size APP.props.$topBar.outerHeight(true),
						footerHeight = APP.props.$mainFooterContent.outerHeight(true);

					APP.props.$mainFooter.height( footerHeight );

					// Correct footer height upon resize and correct top body padding for navbar height
					APP.props.$topBar.css({
						'position'			: 'fixed',
						'top'				: '0'
					});
					//APP.props.$mainNav.css({
					//	'top'		: topBarHeight
					//});
					APP.props.$bodyElement.css({
						//'padding-top'		:topBarHeight+1,
						'padding-bottom'	:footerHeight//,
					});
				},
				args:[] // No arguments, so it's an empty array.
			});


			//APP.manageResize();
			/*
			Setup throttling for resize tasks. Run the manageResize function once upon init. This part relies upon having UnderscoreJS
			loaded along with jQuery. It runs all resize tasks every quarter-second.
			http://underscorejs.org/
			*/
			var throttled = _.throttle(APP.manageResize, 250);
			//var debounced = _.debounce(APP.manageResize, 250);
			$(window).resize(throttled);
		},
		addResizeTask : function(task) {
			/*
			Adds and object with a "func" property and an "args" property. This is VERY important, because we use the apply() method
			in manageResize(). All tasks in the queue will be run during resize. We throttle resizing to keep things from getting too crazy.

			Basic syntax:
			myTask = {func:myFunction, args:[arg1,arg2]}

			Example of adding a task:
			var myTask = { func: function(){console.log("I'm resizing!")} }
			APP.addResizeTask(myTask);

			Or you could be fancy and do this:
			APP.addResizeTask( { func: function(){console.log("I'm resizing!")} } );
			*/

			task.args = task.args || [];
			APP.resizeTasks.push(task);
		},
		manageResize : function() {
			/* Cycle through resize tasks. */
			for (var i = 0; i < APP.resizeTasks.length; i++) {
				var task = APP.resizeTasks[i];
				task.func.apply(this, task.args);
			}
		}		
	}
	return APP;
})();
SITE.init();
