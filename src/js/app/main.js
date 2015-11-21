"use strict"

/*
function App(){

	this.window = $(window);

	this.mainContainer = $('main');

	// Signals
	this._onResize = new signals.Signal();
	this._onUpdate = new signals.Signal();

	// Datas
	this.datas = null;

	// Datas path
	this.datasPath = '/assets/json/';

	// Save templates
	this.templates = window.templates;

	// Set lang
	this.lang = 'fr';

	// Init
	this.init();

};

// Init app
App.prototype.init = function() {
	
	// Load datas
	this.loadDatas();

};

// Load datas 
App.prototype.loadDatas = function() {
	
	// Save context
	var self = this;

	// Get datas
	$.getJSON( this.datasPath + this.lang + '.json', function(response){

		// Save datas
		self.datas = response;

		// Once datas are loaded
		self.onDatasLoaded();

	});

};

// Once datas are loaded
App.prototype.onDatasLoaded = function() {

	// Bind common events
	this.bind();

	// Create router
	this.router = new Router();

	// Create viewController
	this.viewController = new ViewController();

	// Create mainLoader
	this.mainLoader = new MainLoader();

	// Listen mainLoader for onAnimateIn event
	this.mainLoader._onAnimateIn.add(this.onMainLoaderAnimateIn, this);

	// Start loading common assets
	this.mainLoader.animateIn();

};

// Bind common events
App.prototype.bind = function() {
	
	// Bind resize event
	this.window.on("resize", $.proxy(this.resize, this));

};

// Resize
App.prototype.resize = function() {
	
	// Save new window width & height
	this.w = this.window.width();
	this.h = this.window.height();

	// Dispatch resize event
	this._onResize.dispatch();

};

// Update
App.prototype.update = function() {
		
	// Dispatch onUpdate event at every requestAnimationFrame
	this._onUpdate.dispatch();

};

// Template
App.prototype.template = function(templateId, datas) {

	// Return compiled template from templateId & datas
	return this.templates[ templateId ]( datas );

};

App.prototype.onMainLoaderAnimateIn = function() {
	
	// Remove listener
	this.mainLoader._onAnimateIn.remove(this.onMainLoaderAnimateIn, this);

	// Bind viewController
	this.viewController.bind();

	// Init router
	this.router.init();

};

App.prototype.getObjectLength = function( obj ){

  return Object.size(obj);

};

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};





*/





/*
var App = function(){

	this.init();

};


App.prototype.init = function() {
	
};

$(document).ready(function(){

	app = new App();

});*/


var explore_speed = 0;

function bindGlobalEvents()
{
	$('.sign-in').submit(function(){
		
		 $.ajax({
            type: "POST",
            url: $(this).attr("action"),
            data: $(this).serialize(),
            success: function(response) {
				Vue_TopBar.username = response.username;
                $('body').addClass('signed-in');
            },
			error: function(error) {
				console.error(error);	
			}
        });
		
		return false;
	});
	
	$('.sign-up').submit(function(){
		
		var that = this;
		 $.ajax({
            type: "POST",
            url: $(this).attr("action"),
            data: $(this).serialize(),
            success: function(response){
				Vue_TopBar.username = $(that).find('[name=username]').val();
                $('body').addClass('signed-in');
            },
			error: function(error) {
				console.error(error);	
			}
        });
		
		return false;
	});
	
	$('.sign-out').click(function(){
		$.ajax({
					type: "POST",
					url: '/api/v1/sign_out',
					success: function () {
						$('body').removeClass('signed-in');
					}
			});
		return false;
	});
	
	
	$(document).on('mousemove', function(e) {
		var window_width = $(window).width();

		var middle_zone_width = 250;
		var minimal_difference = 100;

		if (e.pageX > window_width/2)
		{
			if (e.pageX < window_width/2 + middle_zone_width)
				var difference = minimal_difference;
			else
				var difference = e.pageX - (window_width/2 + middle_zone_width) + minimal_difference;
		}
		else
		{
			if (e.pageX > window_width/2 - middle_zone_width)
				var difference = minimal_difference;
			else
				var difference = e.pageX - (window_width/2 - middle_zone_width) + minimal_difference;
		}

		explore_speed = -difference*0.2;

	});
}


var username, mail, user_id;

var Vue_TopBar = new Vue({
	el: '.top-bar',
	data: {username: null}
});

$.ajax({
	type: "GET",
	url: '/api/v1/signed_in',
	success: function(data) {
		if (data.signed_in)
		{
			user_id = data.user_id;
			username = data.username;
			mail = data.mail;
			
			Vue_TopBar.username = username;
			
			
			$('body').addClass('signed-in');
		}
	}
});

bindGlobalEvents();



var Vue_ExploreWords = new Vue({
	el: '.explore-words',
	data: {words: {}}
});

$.ajax({
	type: "GET",
	url: '/api/v1/words',
	success: function(data) {
		var words = data.words;
		
		
		var previous_word;
		var words_and_positions = words.map(function(word_data, i, words_data) {
			previous_word = previous_word || {word: '', position: {left: 0, top: 0}};
			previous_word = $.extend({},word_data,{
				position: {
					left: previous_word.position.left + previous_word.word.length * 50,
					top: Math.random() * 800
				}
			});
			return previous_word;
		});

		console.log(words_and_positions);
		Vue_ExploreWords.words = words_and_positions;

		$('.word').click(onWordClick);
	}
});





























function r(r) { console.log(r); }


function hideWords()
{
	$('.word').off('click');
}

var onWordClick = function() {
	hideWords();
	TweenMax.to($(this), 1, {transform: 'scale(3)', ease: Power1.easeOut})
}



function onAnimationFrame() {
	return;
	if($('.explore_frieze').get(0)._gsTransform !== undefined && $('.explore_frieze').get(0)._gsTransform.x+explore_speed >= 0)
		return;

	TweenMax.to($('.explore_frieze'), 1, {x: '+='+explore_speed, ease: Power1.easeOut})
};

(function raf(){
	onAnimationFrame();
	window.requestAnimationFrame(raf);
})();


	