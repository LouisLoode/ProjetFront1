var Page_Profile = function() {
	this.Vue = new Vue({
		el: '.profile',
		data: {username: '', items: {}}
	});
	
	Page.apply(this, arguments);
}


Page_Profile.prototype = Object.create(Page.prototype);

Page_Profile.prototype.bindEvents = function () {
 
}

Page_Profile.prototype.run = function(user_id) {
	// $('section').removeClass('active');
	$.ajax({
		type: "GET",
		url: '/api/v1/user/' + user_id +'/stars',
		success: function(data) {
			this.Vue.username = data.username;
			this.Vue.items = data.items;
		}.bind(this)
	});


}