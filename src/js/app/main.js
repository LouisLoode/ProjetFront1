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

// -- CONFIG, MISC -- //


// -- GLOBAL -- //

var Vue_TopBar = new Vue({
	el: '.top-bar',
	data: {username: null}
});

function bindGlobalEvents()
{
	$('.user-greeting .me').click(function() {
		$('section').removeClass('active');
		profile(user_id);
		return false;
	});
	
	$('.sign-in').submit(function(){
		
		 $.ajax({
            type: "POST",
            url: $(this).attr("action"),
            data: $(this).serialize(),
            success: function(response) {
				getAndRefreshAuthenticationInfo();
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
				getAndRefreshAuthenticationInfo();
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
}

bindGlobalEvents();

var username, mail, user_id;
function getAndRefreshAuthenticationInfo() {
	$.ajax({
		type: "GET",
		url: '/api/v1/signed_in',
		success: function(data) {
			if (data.signed_in)
			{
				user_id = parseInt(data.user_id);
				username = data.username;
				mail = data.mail;

				Vue_TopBar.username = username;


				$('body').addClass('signed-in');
			}
		}
	});
}
getAndRefreshAuthenticationInfo();

// -- EXPLORE WORDS -- //

var explore_speed = 0;

var Vue_ExploreWords = new Vue({
	el: '.explore-words',
	data: {words: {}}
});

function bindExploreWordsEvents()
{
	$(document).on('mousemove', function(e) {
		var window_width = $(window).width();

		var middle_zone_width = 100;
		var minimal_difference = 100;

		if (e.pageX > window_width/2)
		{
			if (e.pageX < window_width/2 + middle_zone_width)
				var difference = minimal_difference;
			else
				var difference = e.pageX - (window_width/2 + middle_zone_width);
		}
		else
		{
			if (e.pageX > window_width/2 - middle_zone_width)
				var difference = minimal_difference;
			else
				var difference = e.pageX - (window_width/2 - middle_zone_width);
		}

		explore_speed = -difference*0.2;
	});
	
	$(document).on('click','.word', function(e) {
		$('section').removeClass('active');
		unbindExploreWordsEvents();
		exploreItems($.trim($(e.target).text()));
		return false;
	});
}

function unbindExploreWordsEvents()
{
	$(document).off('mousemove');
	$('.word').off('click');
}

bindExploreWordsEvents();

function onAnimationFrame() {
	
	
	if($('.explore-words .translatable').get(0)._gsTransform !== undefined && ($('.explore-words .translatable').get(0)._gsTransform.x+explore_speed >= 0 || $('.explore-words .translatable').get(0)._gsTransform.x+explore_speed <= -$('.explore-words .translatable').width() + $(window).width()))
	{
		return;
	}
	TweenMax.to($('.explore-words .translatable'), 1, {x: '+='+explore_speed, ease: Power1.easeOut})
};

(function raf(){
	onAnimationFrame();
	window.requestAnimationFrame(raf);
})();

// -- EXPLORE ITEMS -- //

var Vue_ExploreItems = new Vue({
	el: '.explore-items',
	data: {items: {}} // @todo add items[0].starred = true/false
});

function exploreItems(word)
{
	$.ajax({
		type: "GET",
		url: '/api/v1/words/'+ encodeURIComponent(word) +'/items',
		success: function(data) {
			var items = data.items;



			Vue_ExploreItems.items = items;
			$('.explore-items').addClass('active');
		}
	});
	
	bindExploreItemsEvents();
}

function bindExploreItemsEvents() {
	$('.explore-items').on('click','.star',function(e){
		$.ajax({
			type: "PUT",
			url: '/api/v1/items/' + $(e.target).data('id') +'/star',
			success: function(data) {
				alert('starred');
			}
		});
		return false;
	});
}

// -- PROFILE -- //

var Vue_Profile = new Vue({
	el: '.profile',
	data: {username: '', items: {}}
});

function profile(user_id)
{
	$.ajax({
		type: "GET",
		url: '/api/v1/user/' + user_id +'/stars',
		success: function(data) {
			var items = data.items;
			Vue_Profile.username = username;
			Vue_Profile.items = items;
			$('.profile').addClass('active');
		}
	});
}

// -- PROCEDURAL APP LAUNCH -- //

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

		Vue_ExploreWords.words = words_and_positions;
		$('.explore-words').addClass('active');
	}
});




































	