/*!
 * jQuery prototypal inheritance plugin boilerplate
 * Author: Alex Sexton, Scott Gonzalez
 * Further changes: @addyosmani
 * Licensed under the MIT license
 */
 
var glideForm = {
 
	init: function(options, elem){
 
		//mix in the passed-in options with the default options
		this.config = $.extend({}, this.defaults, options);
 
		//save the element reference, both as a jQuery
		//reference and a normal reference
		this.elem  = elem;
		this.$elem = $(elem);
 
		//build the DOM's initial structure
		this.build();

		this.events();
 
		//return this so that we can chain and use the bridge with less code.
		return this;
	},
 
	defaults: {
 
 		animation: 'slide',
 		animationSpeed: 100,
 		cssTab: '.gf-tab',
 		localStorage: true,
 		open: false,
 		saveInterval: 5000,
 		scroll: true,
 		width: false
	},
 
	build: function(){

		this.getWidth(); //find width

		if(!this.config.scroll) this.$elem.css('position', 'absolute'); //don't scroll

		if(!this.config.open) this.posForm();  //position form

		if(this.config.localStorage && (typeof(Storage) !== "undefined")) this.localStorage();

		else this.config.localStorage = false; //localStorage not supported
	},

	events: function(){

		var that = this;

		this.$elem.on('submit', function(e){

			e.preventDefault();

			var data;

			if(that.config.localStorage){

				if(localStorage.form) localStorage.removeItem('form');
			}

			this.submit();
		});

		this.$elem.on('reset', function(e){

			if(that.config.localStorage){

				if(localStorage.form) localStorage.removeItem('form');
			}

			that.$elem.find('textarea').html('');
		});

		this.$elem.on('click', function(){

			if(!that.config.open){

				if(that.config.animation === 'slide'){ //slide

					that.$elem.animate({'left' : 0}, that.config.animationSpeed, function(){
					
						that.config.open = true;
					});
				}
				else{ //toggle

					that.$elem.css('left', 0);

					that.config.open = true;
				}

				if(that.config.localStorage){

					that.config.interval = window.setInterval(function(){ that.save(); }, that.config.saveInterval);
				}
			}
		});

		$(this.config.cssTab).on('click', function(){

			if(that.config.open){

				if(that.config.animation === 'slide'){ //slide

					var width;

					width = parseInt(that.config.width) + 2 + 'px'; //add 2 px for tab

					that.$elem.animate({'left' : '-' + width}, that.config.animationSpeed, function(){
					
						that.config.open = false;
					});
				}
				else{ //toggle

					that.posForm(); //position form
				}

				if(that.config.localStorage){

					that.save();

					clearInterval(that.config.interval);
				}
			}
		});

		$(this.config.cssTab).on('mouseenter', function(){

			if(that.config.open) return; //if open, just return

			that.$elem.css('left', '-' + that.config.width); //set left position
		});

		$(this.config.cssTab).on('mouseleave', function(){

			var width;

			if(that.config.open) return; //if open, just return

			width = parseInt(that.config.width) + 2 + 'px'; //add 2 px for tab

			that.$elem.css('left', '-' + width); //set left position
		});
	},

	getWidth: function(){

		//if width is set, set elem to it, else, find it dynamically
		if(this.config.width) this.$elem.css('width', this.config.width);

		else this.config.width = this.$elem.outerWidth() + 'px';
	},

	posForm: function(){

		var width;

		width = parseInt(this.config.width) + 2 + 'px'; //add 2 px for tab

		this.$elem.css('left', '-' + width); //set left position

		this.config.open = false;
	},

	localStorage: function(){

		var that = this;

		this.config.interval = false;

		this.load();
	},

	save: function(data){

		//prepare data
		data = this.serializeObject(this.$elem);
		data = JSON.stringify(data);

		//store in localStorage
		localStorage.form = data;
	},

	load: function(){

		var data;

		//store data, else return
		if(localStorage.form) data = localStorage.form; else return;

		//parse json into js object
		data = JSON.parse(data);

		this.$elem.find('input').each(function(i, el){

			var $el = $(el),
				name,
				type;

			//store attrs
			name = $el.attr('name');
			type = $el.attr('type');

			//if in data
			if(name in data){

				//if checkbox or radio and on, check
				if((type === 'checkbox' || 'radio') && (data[name] === 'on')){

					$el.attr('checked', 'checked');
				}

				//if text or textfield
				if(type === 'text' || 'textfield'){

					if(data[name]) $el.val(data[name]);
				}
			}
		});

		this.$elem.find('textarea').each(function(i, el){

			var $el = $(el);

			//store attr
			name = $el.attr('name');

			//if in data
			if(name in data){

				if(data[name]) $el.html(data[name]);
			}
		});
	},

	serializeObject: function(form){

		var o = {},
			a = form.serializeArray();

		$.each(a, function() {

			if(o[this.name] !== undefined){

				if(!o[this.name].push){

					o[this.name] = [o[this.name]];
				}
				
				o[this.name].push(this.value || '');
			}
			else{

				o[this.name] = this.value || '';
			}
		});

		return o;
	}
};
 
//Object.create support test, and fallback for browsers without it
if (typeof Object.create !== 'function'){
 
	Object.create = function (o){
 
		function F() {}
 
		F.prototype = o;
 
		return new F();
	};
}
 
//create a plugin based on a defined object
$.plugin = function(name, object){
 
	$.fn[name] = function(options){
 
		return this.each(function(){
 
			if (!$.data(this, name)){
 
				$.data( this, name, Object.create(object).init(options, this));
			}
		});
	};
};
 
// Usage:
$.plugin('glideForm', glideForm);