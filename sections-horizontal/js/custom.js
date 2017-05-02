;var SITE = SITE || (function(){
	var APP = {
		resizeTasks : [],
		init : function() {
			APP.props = {
				$bodyElement		: $('body'),
				$appWrap			: $('#app-wrap'),
				$jumbotrons			: $('.jumbotron-fluid'),
				scrolling			: false,
				size				: '',
				breakpoints			: {
					xs: 0,
					sm: 576,
					md: 768,
					lg: 992,
					xl: 1200
				},
				transEnd			: (function(){
					// This function gets the browser's name for "transitionend" and saves it to a prop which 
					// may then be used by other functions to detect the end of a CSS3 transition.
					var t;
					var el = document.createElement('fakeelement');
					var transitions = {
						'transition':'transitionend',
						'OTransition':'oTransitionEnd',
						'MozTransition':'transitionend',
						'WebkitTransition':'webkitTransitionEnd'
					}

					for(t in transitions){
						if( el.style[t] !== undefined ){
							return transitions[t];
						}selector
					}
				})()
			};
			/*
			APP.addResizeTask({
				func: function() {

					var footerHeight = APP.props.$mainFooterContent.outerHeight(true);

					// Update the height of jumbotrons.
					APP.props.$jumbotrons.css({
						'min-height'			: window.screen.height//$(window).height()
					}).removeClass('absolute-center');

					APP.props.$jumbotrons.each(function(index){
						var thisHeight = $(this).height(),
							contentHeight = $(this).children('.container').outerHeight(),
							newTopPadding = '3em';

						//console.log('thisHeight = ' + thisHeight);
						//console.log('contentHeight = ' + contentHeight);
						//console.log('-- difference = ' + ((thisHeight - contentHeight) / 2) );
						//console.log(' ');

						if(contentHeight < thisHeight && APP.getSiteViewType() !== 'xs' && APP.getSiteViewType() !== 'sm') {
							newTopPadding = ((thisHeight - contentHeight) / 2) + 'px';
						}
						$(this).css({
							'padding-top' : newTopPadding
						});
					});


					// Update the view type.
					APP.props.size = APP.getSiteViewType();
				},
				args:[] // No arguments, so it's an empty array.
			});
			*/

			APP.addListeners();
			APP.manageResize();

			// Setup throttling for resize tasks. Run the manageResize function once upon init. This part relies upon having 
			// UnderscoreJS loaded along with jQuery. It runs all resize tasks every quarter-second.
			// http://underscorejs.org/
			var throttled = _.throttle(APP.manageResize, 250);
			//var debounced = _.debounce(APP.manageResize, 250);
			$(window).resize(throttled);
		},
		addListeners : function() {
			APP.props.$bodyElement.on('click', function(event){
				event.preventDefault();
				var $target = $(event.target);

				if ( $target.is('.step-nav.prev') ) {
					console.log('prev');
					setNextStep('prev');
				}
				if ( $target.is('.step-nav.next') ) {
					console.log('next');
					setNextStep('next');
				}



			});
			function setNextStep(direction) {
				var currentStep = APP.props.$appWrap.data('step');
				console.log('currentStep before = ' + currentStep);

				if (direction === 'next') {
					currentStep++;
				} else {
					currentStep--;
				}

				console.log('currentStep after = ' + currentStep);
				currentStep = currentStep > 3		? 3					: currentStep;
				currentStep = currentStep < 1		? 1					: currentStep;

				APP.props.$appWrap.data('step', currentStep);
				APP.props.$appWrap.removeClass('step-1 step-2 step-3').addClass('step-'+currentStep);
				return currentStep;
			}
		},
		getSiteViewType : function() {
			var sizes = APP.props.breakpoints,
				currentSize = APP.props.$bodyElement.outerWidth(true),
				sizeType = "xs";

			if ( currentSize >= sizes.sm ) {
				sizeType = "sm";
			}
			if ( currentSize >= sizes.md ) {
				sizeType = "md";
			}
			if ( currentSize >= sizes.lg ) {
				sizeType = "lg";
			}
			if ( currentSize >= sizes.xl ) {
				sizeType = "xl";
			}
			return sizeType;
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
