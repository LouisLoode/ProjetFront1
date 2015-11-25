var Page_Home = function() {
	this.Vue = new Vue({
		el: '.home',
		data: {}
	});
	
	Page.apply(this, arguments);
}
 console.log('Fonction chargement page fonctionne');
Page_Home.prototype = Object.create(Page.prototype);

Page_Home.prototype.bindEvents = function () {

	$(document).on('click','#start', function(e) {
			app.goTo('exploreWords');
			return false;
		});
 console.log('Fonction chargement page fonctionne');

}

Page_Home.prototype.run = function () {

console.log('Fonction chargement page fonctionne');
      $( document ).ready(function() {
      console.log('Fonction chargement page fonctionne');
      });

}