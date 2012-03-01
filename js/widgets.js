
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
						step: 'Code',
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
						step: 'Species',
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
						step: 'Location',
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
								type: 'text',
								placeholder: 'YEAR',
								size: 'short',
								name: 'collection_year'
							}
						],
						step: 'Collection date',
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
						step: 'Collector',
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
						step: 'Transferer',
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
								type: 'text',
								placeholder: 'YEAR',
								size: 'short',
								name: 'transfer_year'
							}
						],
						step: 'Transfer date',
						ok: 'out'
					},
					{
						label: 'Can you detect this information?.',
						inputs: [
							{
								type: 'select',
								placeholder: 'GENDER',
								size: 'short',
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
								source: ['skin','...','....']
							}
						],
						step: 'Other',
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

				// Bind events
				Core._bind($el);
			});
		},
 

		_bind: function($el) {
			// Start or finish record
			$el.find('a.checkRecord').bind({'click': Core._checkRecord});

			// Submit form
			$el.find('form').bind({'submit': Core._nextRegister});

			// Step list
			$el.find('ul.steps li a').bind({'click': function(ev) {Core._nextRegister(ev,parseInt($(ev.target).attr('href').replace('#goto_','')))} })

			// See the example

			// Skip the field

			// See the registers completed

			// Cancel

			// Save record

			// Location autocomplete
			//$('input[name="location"]').

			// Species autocomplete
			//$('input[name="species"]').autocomplete({source:...})
		},


		_trigger : function ( eventName, data, $el ) {
			var isGlobal = $.inArray( eventName, Core.options.globalEvents ) >= 0, eventName = eventName + '.' +  Core.pluginName;

			if (!isGlobal) {
				$el.trigger( eventName, data );
			} else {
				$.event.trigger( eventName, data );
			}
		},


		/**
		 * Stop propagation function
		 */
		_preventDefault: function(ev) {
			ev.preventDefault();
		},


		/**
		 * Create a loader for the image
		 */
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


		/**
		 * Remove the loader after the image is loaded
		 */
		_removeLoader: function($el) {
			$el.find('div.loader').animate({
				opacity:0
			},500,function(ev){
				$(this).remove();
			})
		},


		/**
		 * Start the transcription after the image is loaded
		 */
		_startTranscription: function(ev) {
			var $el = $(ev.target).closest('div.transcribing');

			// Remove Loader
			Core._removeLoader($el);

			// Show footer
			$('footer').show();

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



		/**
		 * Create the transcriber, adding one by one the neccessary elements
		 */
		_createTranscriber: function($el) {
			var $transcriber = $('<div>').attr('id','transcriber')
				, $top = $('<div>').addClass('top')
				, $bottom = $('<div>').addClass('bottom');

			// ADD THE DIFFERENT ELEMENTS
			// - title top list
			$top.append(Core._createTitles());

			// - explanations bottom list
			$bottom.append(Core._createExplanations());

			// - record steps bottom
			$bottom.append(Core._createRecord());

			// - save record tooltip

			// - skip register tooltip



			// Add all elements to the transcriber
			$transcriber.append($bottom)
			$transcriber.append($top);

			// Add to the stage
			$el.append($transcriber);

			// Give it resize and move funcionalities
			var _width = $transcriber.parent().width();

			$transcriber
				.resizable({ containment: 'parent', minHeight: 180, handles: 'se', minWidth: _width })
				.draggable({ containment: "parent", axis: "y" });


			// Start variables (step, values, ...)
			$el.data('step',0);
			$el.data('values',{});
		},




		/**
		 * CREATE, MANAGE AND RESET TITLE TOP LIST
		 */

		/**
		 * first create the titles list
		 * return @list : returns the titles top list
		 */
		_createTitles: function() {
			var $list = $('<ul class="titles">');

			// Add titles list
			for (var i = 0, _length = Core.options.titles.length; i < _length ; i++) {
				$list.append('<li ' + (i==0 ? 'class="selected"' : '' ) + '><label>' + Core.options.titles[i] + '</label></li>');
			}

			// Return top
			return $list;
		},


		/**
		 * manage titles list
		 */
		_manageTitles: function($el,step,previous) {
			var $list = $el.find('div.top > ul.titles');

			if (step == previous) return false;

			$list.find('> li:eq(' + previous + ')').fadeOut(300,
				function(ev) {
					$list.find('> li:eq(' + step + ')').fadeIn(300);
				}
			);
		},


		/**
		 * reset titles list
		 */
		_resetTitles: function($el) {
			// Go o the first of the list
			Core._manageTitles($el);
		},



		
		/**
		 * CREATE, MANAGE AND RESET EXPLANATION BOTTOM LIST
		 */

		/**
		 * first create the explanations
		 */
		_createExplanations: function() {
			var $list = $('<ul>').addClass('explanations');


			// Add titles list
			for (var i = 0, _length = Core.options.explanations.length; i < _length ; i++) {
				var li = '<li ' + (i==0 ? 'class="selected"' : '') + '>'
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
								li += '<span class="wrapper ' + input.size + '"><select name="' + input.name + '">';

								// Disabled
								li += '<option value="0" selected disabled>' + input.placeholder + '</option>';

								for (var z = 0, source_length = input.source.length; z < source_length; z++) {
									li += '<option value="' + input.source[z] + '">' + input.source[z] + '</option>';
								}

								li += '</select></span>'
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
				li += '</li>';

				// Add to list
				$list.append(li);
			}

			// Customize added selects
			$list.find('select').sSelect();

			// Return top
			return $list;
		},

		/**
		 * manage explanations every change or step
		 */
		_manageExplanations: function($el,step,previous) {
			var $list = $el.find('ul.explanations');

			if (step == previous) return false;

			$list.find('> li:eq(' + previous + ')').fadeOut(300,
				function(ev) {
					$list.find('> li:eq(' + (step) + ')').addClass('selected').fadeIn(300);
				}
			);
		},

		/**
		 * reset explanations list every time a record start
		 */
		_resetExplanations: function($el) {

		},






		/**
		 * CREATE, MANAGE AND RESET RECORD BOTTOM CONTENT
		 */

		/**
		 * first create the record content
		 */
		_createRecord: function() {
			var $record = $('<div>').addClass('record right');

			$record.append('<div class="right"><a class="button green checkRecord" href="#start">START THIS RECORD</a></div>');

			// Create step_viewer
			$record.find('div.right').append(Core._createStepViewer());

			return $record;
		},

		/**
		 * Manage record
		 */
		_manageRecord: function($el,step,previous) {
			// Manage first the button
			$el.find('div.bottom div.record a.checkRecord').text('FINISH THE RECORD').attr('href','#finish'); // Decide if will be orange or green the step viewer				

			// Manage the step viewer
			$el.find('div.bottom div.record a.choose_step').text(step + '/' + (Core.options.explanations.length - 1));
			Core._manageStepViewer($el,step);
		},

		/**
		 * reset record
		 */
		_resetRecord: function(ev) {

		},


		/**
		 * Check record, if starts or finish, and check values
		 */
		_checkRecord: function(ev) {

			Core._preventDefault(ev);

			var $el = $(ev.target).closest('div.transcribing')
				, step = $el.data('step')
				, $transcriber = $el.find('div#transcriber');

			
			if (step==0) {

				// Disable drag and resize
				$transcriber
					.resizable({ disabled: true })
					.draggable({ disabled: true });

				// Start $el values
				$el.data('values',Core._resetValues($el));


				// Show step viewer
				$el.find('div.step_viewer').fadeIn(300);

				// If step is 0, is starting
				Core._nextRegister($el);

			} else {
				
				var pending = Core._pendingRegisters($el);
				if (pending==0) {
					// If has finished just save and go for the next
					Core._nextRecord($el);
				} else {
					// If not, show the tooltip
					alert('tooltip');
				}
			}
		},


		/**
		 * Check record, if starts or finish, and check values
		 */
		_createStepViewer: function() {
			var $stepviewer = $('<div>').addClass('step_viewer');
			
			// Select option
			$stepviewer.append('<a class="choose_step" href="#choose_step">1/' + (Core.options.explanations.length - 1) + '</a>');

			// Step list
			var list = '<ul class="steps">'

			for (var i = 0; i < Core.options.explanations.length; i++) {
				var obj = Core.options.explanations[i];

				if (obj.step) {
					list += '<li ' + (i==1 ? 'class="selected"' : '') + '><a href="#goto_' + i + '"><span class="circle"></span>' + obj.step + '</a></li>';
				}					
			}

			list += '<span class="tail"></span></ul>';
			$stepviewer.append(list);


			// LOCAL BINDINGS
			
			// Manage bind of the option
			$stepviewer.find('a.choose_step').click(
				function(ev) {
					Core._preventDefault(ev);

					var $parent = $(ev.target).parent()
						, $steps = $parent.find('ul');

					if (!$steps.is(':visible')) {
						$steps.show();
						ev.stopPropagation();
						$('body').click(function(ev){
							$steps.hide();
							$('body').unbind('click');
						});
					} else {
						$steps.hide();
					}
				}
			)

			return $stepviewer;
		},


		/**
		 * Check step lists
		 */
		_manageStepViewer: function($el,step) {
			// Check list
			var values = $el.data('values')
				, pending = 0
				, $list = $el.find('ul.steps');


			// Until the end
			for (var i = 0; i < values.length; i++) {

				var obj = values[i]
					, completed = true
					, $li = $list.find('li:eq(' + i + ')');

				for (name in obj) {
					if (obj[name] == '') {
						pending++;
						completed = false;
					}
				}

				// Selected?
				if (i==(step-1)) {
					$li.addClass('selected');
				} else {
					$li.removeClass('selected');
				}

				// Completed?
				if (completed) {
					$li.addClass('completed');
				} else {
					$li.removeClass('completed');
				}
			}

			var $record_button = $el.find('div.bottom a.checkRecord');

			if (pending>0) {
				$record_button.removeClass('green').addClass('orange');
			} else {
				$record_button.removeClass('orange').addClass('green');
			}
		},





		/**
		 * Reset values of the transcriber
		 */
		_resetValues: function($el) {
			var values = [];

			for (var i = 1, _length = Core.options.explanations.length; i < _length; i++) {
				var register = Core.options.explanations[i];
				values[i - 1] = {};
				for (var j = 0, __length = register.inputs.length; j < __length; j++) {
					values[i - 1][register.inputs[j].name] = '';
				}
			}

			return values;
		},




		/**
		 * Go for the next register, checking all the elements in the
		 * transcriber
		 */
		_nextRegister: function(unde,to) {
			var $el;

			// It could be a event or the element
			if (unde.target!=undefined) {
				Core._preventDefault(unde);
				$el = $(unde.target).closest('div.transcribing');
			} else {
				$el = unde;
			}

			var previous = $el.data('step')
				, step = to || Core._checkRegister($el,previous);

			$el.data('step',step);

			Core._saveRegister($el,previous);

			// Manage explanations list
			Core._manageExplanations($el,step,previous);

			// Manage titles list
			Core._manageTitles($el,step,previous);

			// Manage record
			Core._manageRecord($el,step,previous);
		},



		/**
		 * Get the next step in the transcriber or finish it
		 */
		_pendingRegisters: function($el) {

			var values = $el.data('values')
				, pending = 0;

			// Until the end
			for (var i = 0; i < values.length; i++) {

				var obj = values[i]
					, completed = true;

				for (name in obj) {
					if (obj[name] == '') {
						pending++;
					}
				}
			}

			return pending;
		},


		/**
		 * Get the next step in the transcriber or finish it
		 */
		_checkRegister: function($el,previous) {

			var values = $el.data('values')
				, next_step = undefined;


			// Until the end
			for (var i = previous; i < values.length; i++) {

				var obj = values[i]
					, completed = true;

				for (name in obj) {
					if (obj[name] == '') {
						completed = false;
						break;
					}
				}

				if (!completed) {
					next_step = i + 1;
					break;
				}
			}


			if (next_step==undefined && previous!=0) {
				// From the beginning
				previous = 0;

				// Until the end
				for (var i = previous; i < values.length; i++) {

					var obj = values[i]
						, completed = true;

						for (name in obj) {
							if (obj[name] == '') {
								completed = false;
								break;
							}
						}

					if (!completed) {
						next_step = i + 1;
						break;
					}
				}
			}

			// If all registers are complete step == 'end'
			return next_step || 'end';
		},


		/**
		 * Save the register if any change happened
		 */
		_saveRegister: function($el,previous) {
			// In the array will be previous - 1
			var values = $el.data('values')
				, $form = $el.find('ul.explanations > li:eq(' + previous + ') form');

			// Loop values
			$form.find('select,input[type="text"]').each(function(i,ele){
				var $ele = $(ele)
					, name = $ele.attr('name')
					, value = $ele.val();

				if (value != '') {
					values[previous-1][name] = value;
				}
			});

			$el.data('values',values);
		},


		/**
		 * Reset the transcriber to start from the beginning
		 */
		_resetTranscriber: function($el) {
			// Reset step and drag&resize
			$el.data({step:0});

			var $transcriber = $el.find('div#transcriber');

			$transcriber
				.resizable({ disabled: false })
				.draggable({ disabled: false });

			// Reset top list
			Core._resetTitles($el);

			// Reset explanation list (bottom)
			Core._resetExplanations($el);

			// Reset record
			Core._resetRecord($el);

			// Start!
			Core._nextRegister($el,0);
		},


		/**
		 * Move forward the transcriber to the next record if there are more.
		 */
		_nextRecord: function($el) {

			var trans_h = $el.find('div#transcriber').position().top
				, trans_y = $el.find('div#transcriber > div.top').height();


			// Save values in the server
			Core._saveRecord($el);

			// Add new record saved to the header count
			var $counter = $('header div.right h5')
				, count = $counter.text();
			$counter.text(parseInt(count) + 1);


			// Reset values and enable drag and resize again
			Core._resetTranscriber($el);

			// Move image
				// Where the transcripter is and height of it
			$el.find('img').animate({
				marginTop: '-=' + (trans_h + trans_y - 10) + 'px'
			},500);
		},


		/**
		 * Save the transcribed record.
		 */
		_saveRecord: function($el) {
			// Get the element values
			var values = $el.data('values');

			// TODO: Add transcribed coordinates???

			// Send them to the server
			$.ajax({
				url: Core.options.saveURL,
				type: 'POST',
				data: values
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