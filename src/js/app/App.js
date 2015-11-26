

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

    
    this.router.get('/', function(req){
		this.goTo('home');
	}.bind(this));

	this.router.get('/debug', function(req){
		this.goTo('exploreWords');
	}.bind(this));
	
	this.router.get('/mot/:word', function(req){
		this.goTo('exploreItems','exploreItemsByWord',req.params.word);
	}.bind(this));

	this.router.get('/profil/:user_id', function(req){
		this.goTo('profile', 'run', req.params.user_id);
	}.bind(this));
	
	this.Vue_TopBar = new Vue({
		el: '.navbar',
		data: {username: null, user_id: -1}
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
					this.Vue_TopBar.user_id = data.user_id;


				}
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

// routing
// https://github.com/visionmedia/page.js
// http://smalljs.org/client-side-routing/page/
// ? https://github.com/chrisdavies/rlite
// > https://github.com/bytecipher/grapnel