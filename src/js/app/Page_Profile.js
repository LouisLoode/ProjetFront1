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