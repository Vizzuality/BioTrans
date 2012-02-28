
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
		, days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
		, months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
		, years = [1950,1951,2011,2012]
		, defaultOptions = {
				globalEvents : [],

				titles: [
					'RECORD POSITION',
					'RECORD CODE',
					'GENUS & SPECIES',
					'COLLECTION LOCATION',
					'COLLECTION DATE ',
					'COLLECTOR',
					'TRANSFERRER',
					'TRANSFER DATE',
					'ADDITIONAL INFORMATION'
				],
				explanations: [
					{
						label: 'Drag & resize the viewer to the record you want to transcribe.'
					},				
					{
						label: 'It’s a 4 digit number located at the top right of the page.',
						inputs: [
							{
								type: 'text',
								placeholder: 'CODE',
								size: 'medium',
								name: 'record_code'
							}
						],
						ok: 'in'
					},
					{
						label: '2 or 3 latin words in the first line, next to the margin.',
						inputs: [
							{
								type: 'text',
								placeholder: 'SPECIES',
								size: 'long',
								name: 'species'
							}
						],
						ok: 'in'
					},
					{
						label: 'A place name, in the second line.',
						inputs: [
							{
								type: 'text',
								placeholder: 'LOCATION',
								size: 'long',
								name: 'location'
							}
						],
						ok: 'in'
					},
					{
						label: 'A date in the third line.',
						inputs: [
							{
								type: 'select',
								placeholder: 'MONTH',
								size: 'medium',
								name: 'collection_month',
								source: months
							},
							{
								type: 'select',
								placeholder: 'DAY',
								size: 'short',
								name: 'collection_day',
								source: days
							},
							{
								type: 'select',
								placeholder: 'YEAR',
								size: 'short',
								name: 'collection_year',
								source: years
							}
						],
						ok: 'out'
					},
					{
						label: 'A person name in the same line than the date.',
						inputs: [
							{
								type: 'text',
								placeholder: 'COLLECTOR',
								size: 'long',
								name: 'collector'
							}
						],
						ok: 'in'
					},
					{
						label: 'A person name at the top right of the record.',
						inputs: [
							{
								type: 'text',
								placeholder: 'TRANSFERER',
								size: 'long',
								name: 'transferer'
							}
						],
						ok: 'in'
					},
					{
						label: 'A date under the transferrer.',
						inputs: [
							{
								type: 'select',
								placeholder: 'MONTH',
								size: 'medium',
								name: 'transfer_month',
								source: months
							},
							{
								type: 'select',
								placeholder: 'DAY',
								size: 'short',
								name: 'transfer_day',
								source: days
							},
							{
								type: 'select',
								placeholder: 'YEAR',
								size: 'short',
								name: 'transfer_year',
								source: years
							}
						],
						ok: 'out'
					},
					{
						label: 'Can you detect this information?.',
						inputs: [
							{
								type: 'select',
								placeholder: 'GENDER',
								size: 'small',
								name: 'gender',
								source: ['male','female']
							},
							{
								type: 'text',
								placeholder: 'AGE',
								size: 'short',
								name: 'age'
							},
							{
								type: 'select',
								placeholder: 'REGISTER',
								size: 'short',
								name: 'register',
								source: ['male','female']
							}
						],
						ok: 'out'
					}
				]
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



		// Create the transcriber
		_createTranscriber: function($el) {
			var transcriber = $('<div>').attr('id','transcriber');

			// Add top and bottom parts
			transcriber.append(Core._addTop());
			transcriber.append(Core._addBottom());

			// Add to the stage
			$el.append(transcriber);

			// Give it resize and move funcionalities
			var _width = transcriber.parent().width();

			transcriber
				.resizable({ containment: 'parent', minHeight: 180, handles: 'se', minWidth: _width })
				.draggable({ containment: "parent", axis: "y" });
		},




		_addTop: function() {
			var $top = $('<div>').addClass('top')
				, $span = $('<span>').addClass('wrapper')
				, $list = $('<ul>');

			// Add titles list
			for (var i = 0, _length = Core.options.titles.length; i < _length ; i++) {
				$list.append('<li><label>' + Core.options.titles[i] + '</label></li>');
			}

			// Append list to top
			$span.append($list);
			$top.append($span);

			// Return top
			return $top;
		},



		_addBottom: function() {
			var $bottom = $('<div>').addClass('bottom')
				, $list = $('<ul>');


			// Add titles list
			for (var i = 0, _length = Core.options.explanations.length; i < _length ; i++) {
				var li = '<li>'
					, obj = Core.options.explanations[i];

				// If there is input|s
				if (obj.inputs) {
					li += '<form class="' + obj.ok + '">';

					for (var j = 0, __length = obj.inputs.length; j < _length; j++) {

						var input = obj.inputs[j];
						
						if (input != undefined) {
							if (input.type == "text") {
								// If type == text
								li += '<input type="text" value="" placeholder="' + input.placeholder + '" name="' + input.name + '" class="' + input.size + '" />';
							} else {
								// If type == select
								li += '<select name="' + input.name + '" class="' + input.size + '">';

								// Disabled
								li += '<option value="0" selected disabled>' + input.placeholder + '</option>';

								for (var z = 0, source_length = input.source.length; z < source_length; z++) {
									li += '<option value="' + input.source[z] + '">' + input.source[z] + '</option>';
								}

								li += '</select>'
							}
						}
					}

					// Add submit button
					li += '<input type="submit" value="ok" class="button green small" />';

					// End form
					li += '</form>';
				}


				// Add the label
				li += '<p>' + obj.label;
				// Add help buttons
				if (obj.inputs) {
					li += ' <a href="#example" class="example">See example</a> | <a href="#skip" class="skip">Skip this field</a><span class="tail"></span>';
				}
				li += '</p>';
				
				// End of li
				li += '<li>';

				// Add to list
				$list.append(li);
			}


			// Append list to bottom
			$bottom.append($list);

			// Add the stylish plugin?
			$bottom.find('select').sSelect();

			// Append step and save specie


			// Return top
			return $bottom;
		},





		// GO TO NEXT SPECIE
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
		},


		// SAVE THE TRANSCRIBED SPECIE DATA
		_saveSpecie: function() {

			// Values currently saved in Core.options.values

			// Send them to the server
			$.ajax({
				url: Core.options.saveURL,
				type: 'POST',
				data: {values: Core.options.values}
			});
		}
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