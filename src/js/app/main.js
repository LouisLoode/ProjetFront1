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






// -- PROCEDURAL APP LAUNCH -- //



/*

pour chaque vue : 
	- une Vue associée (doit être construire à l'init) ==> __construct
	- un entry point (fonction à éxecuter) ->show(); ==> show()
	quand on veut sortir : App->goTo(pageExploreWord,arg,arg) (sûr ?)
	
	- une méthode bindEvents ==> bindEvents() (private?)
	- une méthode unbindEvents (à la sortie) ==> unbindEvents (private?)
	
	loader etc ?
	
pour le router (peut-être dans app)
	- 

// dans un second temps, peut-être que Page hérite de AppComponent pour qu'on puisse appeler this.app

*/

// @dependency Grapnel
var App = function() {
	this.username = null,
	this.mail = null;
	this.user_id = null;
	this.currentPage = null;
	
	this.pages = {
		profile: new Page_Profile(),
		exploreWords: new Page_ExploreWords(),
		exploreItems: new Page_ExploreItems()
	}
	
	this.router = new Grapnel({ pushState : true });

	this.router.get('/', function(req){
		this.goTo('exploreWords');
	}.bind(this));

	this.router.get('/mot/:word', function(req){
		this.goTo('exploreItems','exploreItemsByWord',req.params.word);
	}.bind(this));

	this.router.get('/profil/:user_id', function(req){
		this.goTo('profile', 'run', req.params.user_id);
	}.bind(this));
	
	this.Vue_TopBar = new Vue({
		el: 'aside',
		data: {username: null}
	});

	this.getAndRefreshAuthenticationInfo();
	this.bindEvents();
}

App.prototype.getAndRefreshAuthenticationInfo = function() {
		$.ajax({
			type: "GET",
			url: '/api/v1/signed_in',
			success: function(data) {
				if (data.signed_in)
				{
					this.user_id = parseInt(data.user_id);
					this.username = data.username;
					this.mail = data.mail;

					this.Vue_TopBar.username = data.username;


					$('body').addClass('signed-in');
				}
			}.bind(this)
		});
}

App.prototype.bindEvents = function () {
	$('.user-greeting .me').click(function() {
		$('section').removeClass('active');
		router.navigate('/profil/' + user_id);
		return false;
	});
	
	$('.sign-in').submit(function(){
		
		 $.ajax({
            type: "POST",
            url: $(this).attr("action"),
            data: $(this).serialize(),
            success: function(response) {
				getAndRefreshAuthenticationInfo();
            }.bind(this),
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
            }.bind(this),
			error: function(error) {
				console.error(error);	
			}
        });
		
		return false;
	}.bind(this));
	
	$('.sign-out').click(function(){
		$.ajax({
					type: "POST",
					url: '/api/v1/sign_out',
					success: function () {
						$('body').removeClass('signed-in');
					}.bind(this)
			});
		return false;
	}.bind(this));
}

App.prototype.goTo = function (newPage, method) {
	console.log(newPage); 
	if (newPage !== this.currentPage)
	{
		if (this.currentPage in this.pages)
		{
			$('.' + this.currentPage.replace(/([A-Z])/g, function(match){ return '-' + match.toLowerCase() })).removeClass('active');
			this.pages[this.currentPage].unbindEvents();
		}
		this.pages[newPage].bindEvents();
	}
	this.currentPage = newPage;
	$('.' + newPage.replace(/([A-Z])/g, function(match){ return '-' + match.toLowerCase() })).addClass('active');
	
	method = method || 'run'; // @todo router, pushstate
	this.pages[newPage][method].apply(this.pages[newPage],Array.prototype.slice.call(arguments, 2));
};

// => widgets 134
// https://github.com/bytecipher/grapnel

// -- PAGE -- //

var Page = function () {
	
}

Page.prototype.bindEvents = function () { }
Page.prototype.unbindEvents = function () { }

// -- PROFILE -- //

var Page_Profile = function() {
	this.Vue = new Vue({
		el: '.profile',
		data: {username: '', items: {}}
	});
	
	Page.apply(this, arguments);
}

Page_Profile.prototype = Object.create(Page.prototype);

Page_Profile.prototype.run = function(user_id) {
	// $('section').removeClass('active');
	$.ajax({
		type: "GET",
		url: '/api/v1/user/' + user_id +'/stars',
		success: function(data) {
			var items = data.items;
			this.Vue.username = username;
			this.Vue.items = items;
			$('.profile').addClass('active');
		}
	});
}

// -- EXPLORE WORDS -- //

var Page_ExploreWords = function() {
	this.Vue = new Vue({
		el: '.explore-words',
		data: {words: {}}
	});
	
	Page.apply(this, arguments);
	
	this.explore_speed = 0;
}

Page_ExploreWords.prototype = Object.create(Page.prototype);

Page_ExploreWords.prototype.run = function()
{
	
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

			this.Vue.words = words_and_positions;
		}.bind(this)
	});
}

Page_ExploreWords.prototype.bindEvents = function() {
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

		this.explore_speed = -difference*0.2;
	}.bind(this));
	
	$(document).on('click','.word', function(e) {
		app.goTo('exploreItems','exploreItemsByWord',$.trim($(e.target).text()));
		return false;
	});
	
	this.onAnimationFrame = function () {
		this.updateTranslatable();
	};
	
	window.requestAnimationFrame(this.onAnimationFrame.bind(this));
}

Page_ExploreWords.prototype.updateTranslatable = function () {
	if($('.explore-words .translatable').get(0)._gsTransform !== undefined && ($('.explore-words .translatable').get(0)._gsTransform.x+this.explore_speed >= 0 || $('.explore-words .translatable').get(0)._gsTransform.x+this.explore_speed <= -$('.explore-words .translatable').width() + $(window).width()))
	{
		//
	}
	else
	{
		TweenMax.to($('.explore-words .translatable'), 1, {x: '+='+this.explore_speed, ease: Power1.easeOut})
	}
	window.requestAnimationFrame(this.onAnimationFrame.bind(this));
}

Page_ExploreWords.prototype.unbindEvents = function() {
	$(document).off('mousemove');
	$('.word').off('click');
	$(document).off('click','.word');
	this.onAnimationFrame = function() {};
}

// -- EXPLORE ITEMS -- //
	
var Page_ExploreItems = function() {
	this.Vue = new Vue({
		el: '.explore-items', // @todo cohérence où est nommée la page
		data: {items: {}} // @todo add items[0].starred = true/false
	});
	
	Page.apply(this, arguments);
}

Page_ExploreItems.prototype = Object.create(Page.prototype);

Page_ExploreItems.prototype.exploreItemsByWord = function (word)
{
	$.ajax({
		type: "GET",
		url: '/api/v1/words/'+ encodeURIComponent(word) +'/items',
		success: function(data) {
			var items = data.items;
			this.Vue.items = items;
		}.bind(this)
	});
}

Page_ExploreItems.prototype.exploreSimilarItems = function (item_id)
{
	console.log('similar');
	$.ajax({
		type: "GET",
		url: '/api/v1/items/'+ item_id +'/similar',
		success: function(data) {
			var items = data.items;
			this.Vue.items = items;
		}.bind(this)
	});
}

Page_ExploreItems.prototype.bindEvents = function () {
	$('.explore-items').on('click','.star',function(e){
		$.ajax({
			type: "PUT",
			url: '/api/v1/items/' + $(e.target).data('id') +'/star',
			success: function(data) {
				alert('starred');
			}.bind(this)
		});
		return false;
	});
	
	$('.explore-items').on('click','.similar',function(e){
		this.exploreSimilarItems(parseInt($(e.target).data('id')));
	}.bind(this));
}



var app = new App();

// routing
// https://github.com/visionmedia/page.js
// http://smalljs.org/client-side-routing/page/
// ? https://github.com/chrisdavies/rlite
// > https://github.com/bytecipher/grapnel






// @todo get list of words for item






	