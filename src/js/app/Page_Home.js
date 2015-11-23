var Page_Home = function() {
	this.Vue = new Vue({
		el: '.home',
		data: {}
	});
	
	Page.apply(this, arguments);
}



Page_Home.prototype.bindEvents = function () {


$(document).on('click','#start', function(e) {
		app.goTo('exploreWords');
		return false;
	});
 
}