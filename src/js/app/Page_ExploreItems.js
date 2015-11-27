var Page_ExploreItems = function() {
	this.Vue = new Vue({
		el: '.explore-items', // @todo cohérence où est nommée la page
		data: {items: {}, word: '', focus: {}} // @todo add items[0].starred = true/false
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
			this.Vue.word = word;
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
			this.Vue.word = '';
		}.bind(this)
	});
}

Page_ExploreItems.prototype.bindEvents = function () {
    $('.top-bar').addClass('show-bar');
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
    
    /*
    // Code de retour à l'exploration des mots
    $('.explore-items').on('click','.star',function(e){
		$.ajax({
			type: "PUT",
			url: '/api/v1/items/' + $(e.target).data('id') +'/star',
			success: function(data) {
				alert('starred');
			}.bind(this)
		});
		return false;
	});*/
	
	$('.explore-items').on('click','.similar',function(e){
		this.exploreSimilarItems(parseInt($(e.target).data('id')));
	}.bind(this));
	

    
    
	var that = this;
	$('.explore-items').on('click','.item', function(e) {
		var focus_id = $(this).data('id');
		that.Vue.focus = that.Vue.items.filter(function(a){ return a.id == focus_id; })[0];
		$('.item-focus').removeClass('hidden');
		// $('.item-focus img').attr('src',$(e.target).find('img').attr('src'));
		console.log($(this).data('id'));
		$('.item-focus .star, .item-focus .similar').attr('data-id',$(this).data('id'));
		
		$.ajax({
			type: "GET",
			url: '/api/v1/items/' + focus_id +'/words',
			success: function(data) {
				that.Vue.focus.words = data.words;
			}
		});
	});
	
	setTimeout(function() {
		$('.explore-items .word.spotlight').addClass('bordered');
	}, 500);
}

Page_ExploreItems.prototype.unbindEvents = function () {
	$('.explore-items').off('click');
	
	$('.explore-items').off('click','.similar');
	
	$('.explore-items').off('click','.item');
	
	$('.explore-items .word.spotlight').removeClass('bordered');
    
    $('.top-bar').removeClass('show-bar');
}