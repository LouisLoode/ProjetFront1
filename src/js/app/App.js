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

// routing
// https://github.com/visionmedia/page.js
// http://smalljs.org/client-side-routing/page/
// ? https://github.com/chrisdavies/rlite
// > https://github.com/bytecipher/grapnel