
/**************************************************************************
* TRANSCRIBING PLUGIN
**************************************************************************/
(function($, window, undefined) {

	// IE 9
	// Chrome
	// Mozilla Firefox
	// Safari
	// Opera

	// constants
	var TRUE = true, FALSE = true, NULL = null
		, name = 'transcriber'
		// Plugin parts
		, Core, API, Helper
		// default options
		, defaultOptions = {
				globalEvents : [],
				controllers : {
					getImages: '...',
					getNext: '...'
				}
		};

				
	/***************************************************************************
	* Private methods
	**************************************************************************/
	Core = {
		pluginName : name,
		options : null,

		_init : function (options) {
			// take user options in consideration
			Core.options = $.extend( true, defaultOptions, options );
			return this.each( function () {
				var $el = $(this);
				
				// Create loader
				Core._createLoader($el);

				// Create transcriber
				Core._createTranscriber($el);

			});
		},
 

		_bind: function($el) {
			// $el.find('a.control').bind({'click': Core._toggle});
			// $el.find('input').bind({'change': Core._changeColor, 'click': Core._stopPropagation});
			// $el.find('span.palette ul li a').bind({'click': Core._chooseColor});
		},


		_trigger : function ( eventName, data, $el ) {
			var isGlobal = $.inArray( eventName, Core.options.globalEvents ) >= 0, eventName = eventName + '.' +  Core.pluginName;

			if (!isGlobal) {
				$el.trigger( eventName, data );
			} else {
				$.event.trigger( eventName, data );
			}
		},


		_stopPropagation: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
		},


		// Create beggining loader
		_createLoader: function($el) {
			// Create loader
			var loader = $('<div>').addClass('loader')
				, spinner = new Spinner({color:'white'}).spin();

			// Add it to its parent
			loader.append(spinner.el);

			// Add loader to the stage
			$el.append(loader);

			// Bind load image
			$el.find('img').bind({'load':Core._startTranscription});
		},


		// Remove begining loader
		_removeLoader: function($el) {
			$el.find('div.loader').animate({
				opacity:0
			},500,function(ev){
				$(this).remove();
			})
		},


		// Show footer
		_showFooter: function() {
			$('footer').show();
		},


		// Start transcription
		_startTranscription: function(ev) {
			var $el = $(ev.target).closest('div.transcribing');

			// Remove Loader
			Core._removeLoader($el);

			// Show footer
			Core._showFooter();

			// Get image width and set its parent to margin auto
			$el.width($(ev.target).width());

			// Set transcriptor width
			$el.find('div#transcriber').width($(ev.target).width() - 2);

			// Enable transcription
			$el.find('div#transcriber').show().animate({
				opacity:1,
				marginTop: '-=35px'
			},500);
		},



		_addTranscriber: function($el) {

		},


		// Create the transcriber
		_createTranscriber: function($el) {
			var transcriber = $('<div>').attr('id','transcriber').append('<div class="top"></div><div class="bottom"><a href="#next">NEXT</a></div>');

			// Add to the stage
			$el.append(transcriber);

			$el.find('a').click(Core._nextSpecie);

			// Give it resize and move funcionalities
			var _width = transcriber.parent().width();

			transcriber
				.resizable({ containment: 'parent', minHeight: 180, handles: 'se', minWidth: _width })
				.draggable({ containment: "parent", axis: "y" });
		},








		_nextSpecie: function(ev) {
			Core._stopPropagation(ev);

			var $el = $(ev.target).closest('div.transcribing')
				, trans_h = $el.find('div#transcriber').position().top
				, trans_y = $el.find('div#transcriber > div.top').height();



			// Reset values and enable drag and resize again


			// Move image
				// Where the transcripter is and height of it
			$el.find('img').animate({
				marginTop: '-=' + (trans_h + trans_y - 10) + 'px'
			},500);
		}



		// Create steps
		// _createFlow: function($el) {

		// },
		// _createStart: function($el) {

		// },
		// _createSecond: function($el) {

		// },
		// _createThird: function($el) {

		// },
		// _createFourth: function($el) {

		// },
		// _createFifth: function($el) {

		// },
		// _createSixth: function($el) {

		// }
	};



	/***************************************************************************
	 * Plugin installation
	**************************************************************************/
	$.fn[name] = function (userInput) {
		// check if such method exists
		if ( $.type( userInput ) === "string" && API[ userInput ] ) {
			return API[ userInput ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		}
		// initialise otherwise
		else if ( $.type( userInput ) === "object" || !userInput ) {
			return Core._init.apply( this, arguments );
		} else {
			$.error( 'You cannot invoke ' + name + ' jQuery plugin with the arguments: ' + userInput );
		}
	};
})( jQuery, window );