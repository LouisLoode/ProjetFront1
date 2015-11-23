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