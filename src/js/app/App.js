
Vue.filter('nl2br', function (value) {
	if (typeof value == 'undefined') return '';
  return value.replace(/\n/g,'<br>');
})
// @dependency Grapnel
var App = function() {
	this.username = null,
	this.mail = null;
	this.user_id = null;
	this.currentPage = null;
	
	this.pages = {
		home: new Page_Home(),
		profile: new Page_Profile(),
		exploreWords: new Page_ExploreWords(),
		exploreItems: new Page_ExploreItems()
	}
	
	
	this.router = new Grapnel({ pushState : true });


	this.router.get('/debug', function(req){
		this.goTo('exploreWords');
	}.bind(this));
	
	this.router.get('/mot/:word', function(req){
		this.goTo('exploreItems','exploreItemsByWord',req.params.word);
	}.bind(this));
	
	this.router.get('/oeuvre/:id', function(req){
		this.goTo('exploreItems','exploreSimilarItems',req.params.id);
	}.bind(this));

	this.router.get('/profil/:user_id', function(req){
		this.goTo('exploreItems', 'exploreProfile', req.params.user_id);
	}.bind(this));
	
	this.Vue_TopBar = new Vue({
		el: '.navbar',
		data: {username: null, user_id: -1, homeUrl: window.location.href.replace(/([a-z0-9])\/.+$/g,'\1')}
	});

	this.getAndRefreshAuthenticationInfo(function() { // first need signed_in before going to exploreitems
		
		if (this.Vue_TopBar.user_id === -1)
		{
			this.router.get('/', function(req){
				this.goTo('home');
			}.bind(this));
		}
		else
		{
			this.router.get('/', function(req){
				this.goTo('exploreWords');
			}.bind(this));
		}
	}.bind(this));
	this.bindEvents();
	
	this.flashMessageTimeout = -1;
	
}

App.prototype.flashMessage = function (message) {
	
	
	$('.flash-message').removeClass('active')
	
	
	if (this.flashMessageTimeout !== -1)
		setTimeout(function() { $('.flash-message').addClass('active').html(message); },400);
	else
		$('.flash-message').html(message).addClass('active');
	
	clearTimeout(this.flashMessageTimeout);
	
	var that = this;
	this.flashMessageTimeout = setTimeout(function(){ $('.flash-message').removeClass('active'); that.flashMessageTimeout = -1; }, 2000);
}

App.prototype.getAndRefreshAuthenticationInfo = function(callback) {
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
					this.Vue_TopBar.user_id = data.user_id;
					// this.user_stars = data.stars;
					
					$('body').addClass('signed-in');
				}
				else
					$('body').removeClass('signed-in');
				if (typeof callback !== 'undefined') callback();
			}.bind(this)
		});
}

App.prototype.bindEvents = function () {
	/*$('.user-greeting .me').click(function() {
		this.router.navigate('/profil/' + this.user_id);
		return false;
	}.bind(this));*/
    
    
    $('.sign-in-button').click(function(){
		$('.subnav').removeClass('active');
		$('.sign-in-subnav').addClass('active');
        return false;
	}.bind(this));
    
    $('.sign-in-off').click(function(){
		$('.sign-in-subnav').removeClass('active');
        return false;
	}.bind(this));
    
    $('.sign-up-off').click(function(){
		$('.sign-up-subnav').removeClass('active');
        return false;
	}.bind(this));
	
	$('.sign-in').submit(function(e){
		
		 $.ajax({
            type: "POST",
            url: $(e.target).attr("action"),
            data: $(e.target).serialize(),
            success: function(response) {
				this.getAndRefreshAuthenticationInfo();
				$('.subnav').removeClass('active');
            }.bind(this),
			error: function(error) {
				console.error(error);	
			}
        });
		
		return false;
	}.bind(this));
	
	$('.sign-up-button').click(function(){
		$('.subnav').removeClass('active');
		$('.sign-up-subnav').addClass('active');
        return false;
	}.bind(this));
	
	$('.sign-up').submit(function(e){
		
		var that = this;
		 $.ajax({
            type: "POST",
            url: $(e.target).attr("action"),
            data: $(e.target).serialize(),
            success: function(response){
				$('.subnav').removeClass('active');
				this.getAndRefreshAuthenticationInfo();
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
						this.Vue_TopBar.username = '';
						this.Vue_TopBar.user_id = -1;
						$('.subnav').removeClass('active');
						$('.body').removeClass('signed-in');
					}.bind(this)
			});
		return false;
	}.bind(this));
    
    $('.top-bar').on('click','.btn',function(e){
        app.goTo('exploreWords');
    }.bind(this));
	
}

App.prototype.goTo = function (newPage, method) {
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

// routing
// https://github.com/visionmedia/page.js
// http://smalljs.org/client-side-routing/page/
// ? https://github.com/chrisdavies/rlite
// > https://github.com/bytecipher/grapnel