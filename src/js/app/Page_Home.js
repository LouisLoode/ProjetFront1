var Page_Home = function() {
	this.Vue = new Vue({
		el: '.home',
		data: {}
	});
	
	Page.apply(this, arguments);
}

Page_Home.prototype.bindEvents = function () {
$('#start').on('click','#start',function(e){
console.log('test clic start');
		
	});
}