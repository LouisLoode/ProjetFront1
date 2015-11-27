var Page_ExploreWords = function() {
	this.Vue = new Vue({
		el: '.explore-words',
		data: {words: {}}
	});
	
	Page.apply(this, arguments);
	
	this.explore_speed = 0;
}

Page_ExploreWords.prototype.run = function()
{
	
	console.log('Fonction chargement page fonctionne');
	$.ajax({
		type: "GET",
		url: '/api/v1/words',
		success: function(data) {
			var words = data.words;
			var translatableHeight = window.innerHeight/3;
			var previous_word;
			var words_and_positions = words.map(function(word_data, i, words_data) {
				previous_word = previous_word || {word: '', position: {left: 0, top: 0}};
				previous_word = $.extend({},word_data,{
					position: {
						left: previous_word.position.left + previous_word.word.length * 50,
						top: Math.random() * translatableHeight 
					}
				});
				return previous_word;
			});

			this.Vue.words = words_and_positions;
		}.bind(this)  
	});
}

Page_ExploreWords.prototype.bindEvents = function() {
	setTimeout(function(){ 
		$('.translatable').addClass('visible');
		$('.explore-words .words').addClass('visible');
	},500);
	
	$(document).on('mousemove', function(e) {
		
		
		
		
		var window_width = $(window).width();
		var middle_zone_width = 100;
		var minimal_difference = 100;

		if (e.pageX > window_width/2)
		{
			if (e.pageX < window_width/2 + middle_zone_width)
				var difference = minimal_difference;
			else
				var difference = e.pageX - (window_width/2 + middle_zone_width);
		}
		else
		{
			if (e.pageX > window_width/2 - middle_zone_width)
				var difference = minimal_difference;
			else
				var difference = e.pageX - (window_width/2 - middle_zone_width);
		}

		this.explore_speed = -difference*0.2;
	}.bind(this));
	
	$(document).on('click','.word', function(e) {
		
		this.unbindEvents();
		var $spotlight = $('.word.spotlight') // .removeClass('spotlight'); // .css($(e.target).offset()).text($(e.target).text());
		var goToExploreItems = function() {
			// todo tweenmax end delay
			
			setTimeout(function() {
				// $spotlight.addClass('spotlight')
				/*TweenMax.to($('.word.spotlight'), 5, {css: {left: '50%', top: '50%'}, onComplete: function() { $(e.target).addClass('bordered'); } });*/
     
				//app.goTo('exploreItems','exploreItemsByWord',$.trim($(e.target).text()));
				
				$('.explore-words').fadeOut(function(){
					$('.explore-words').removeClass('active');
				
					$(e.target).css({opacity: 0});
					$('.explore-items').css({opacity: 0});
					app.router.navigate('/mot/'+$.trim($(e.target).text()));
					
					$('.explore-items').animate({opacity: 1});
				});
				
			},1000);
		};
		
		TweenMax.to($('.explore-words .word').not(e.target), 1.3, {opacity: 0, onComplete: goToExploreItems});
		
		return false;
	}.bind(this));
	
	this.onAnimationFrame = function () {
		this.updateTranslatable();
	};
	
	window.requestAnimationFrame(this.onAnimationFrame.bind(this));
}

Page_ExploreWords.prototype.updateTranslatable = function () {
	if(false && $('.explore-words .translatable').get(0)._gsTransform !== undefined && ($('.explore-words .translatable').get(0)._gsTransform.x+this.explore_speed >= 0 || $('.explore-words .translatable').get(0)._gsTransform.x+this.explore_speed <= -$('.explore-words .translatable').width() + $(window).width()))
	{
		//
	}
	else
	{
		if ($('.word:hover').length)
			var diviser = 4;
		else
			var diviser = 1;
		
		// recup get et modulo
		
		if (typeof $('.explore-words .translatable--0').get(0)._gsTransform == 'undefined')
			var tr0 = 0;
		else {
			var tr0 = $('.explore-words .translatable--0').get(0)._gsTransform.x +this.explore_speed/4/diviser;
			if (tr0>0) {
				tr0 = tr0-$('.explore-words .translatable--0 img').eq(0).width();
				TweenMax.set($('.explore-words .translatable--0'), {x: $('.explore-words .translatable--0').get(0)._gsTransform.x-$('.explore-words .translatable--0 img').eq(0).width()}) // set to same position in image, except it's another image
				TweenMax.to($('.explore-words .translatable--0'), 1, {x: tr0, ease: Power1.easeOut}) // ease as expected
			}
			else if (tr0<-$('.explore-words .translatable--0 img').eq(0).width())
			{
				tr0 = $('.explore-words .translatable--0 img').eq(0).width()+tr0;
				TweenMax.set($('.explore-words .translatable--0'), {x: $('.explore-words .translatable--0 img').eq(0).width()+$('.explore-words .translatable--0').get(0)._gsTransform.x}) // set to same position in image, except it's another image
				TweenMax.to($('.explore-words .translatable--0'), 1, {x: tr0, ease: Power1.easeOut}) // ease as expected
			}
		}
		
		TweenMax.to($('.explore-words .translatable--0'), 1, {x: tr0, ease: Power1.easeOut})
		
		if (typeof $('.explore-words .translatable--1').get(0)._gsTransform == 'undefined')
			var tr1 = 0;
		else {
			var tr1 = $('.explore-words .translatable--1').get(0)._gsTransform.x +this.explore_speed/3/diviser;
			if (tr1>0) {
				tr1 = tr1-$('.explore-words .translatable--1 img').eq(0).width();
				TweenMax.set($('.explore-words .translatable--1'), {x: $('.explore-words .translatable--1').get(0)._gsTransform.x-$('.explore-words .translatable--1 img').eq(0).width()}) // set to same position in image, except it's another image
			}
			else if (tr1<-$('.explore-words .translatable--1 img').eq(0).width())
			{
				tr1 = $('.explore-words .translatable--1 img').eq(0).width()+tr1;
				TweenMax.set($('.explore-words .translatable--1'), {x: $('.explore-words .translatable--1 img').eq(0).width()+$('.explore-words .translatable--1').get(0)._gsTransform.x}) // set to same position in image, except it's another image
			}
		}
		
		TweenMax.to($('.explore-words .translatable--1'), 1, {x: tr1, ease: Power1.easeOut})
		
		if (typeof $('.explore-words .translatable--2').get(0)._gsTransform == 'undefined')
			var tr2 = 0;
		else {
			var tr2 = $('.explore-words .translatable--2').get(0)._gsTransform.x +this.explore_speed/2/diviser;
			if (tr2>0) { // if we're going left, to the left of the middle image, we switch to the beginning of the third (right-hand-side) image
				tr2 = tr2-$('.explore-words .translatable--2 img').eq(0).width();
				TweenMax.set($('.explore-words .translatable--2'), {x: $('.explore-words .translatable--2').get(0)._gsTransform.x-$('.explore-words .translatable--2 img').eq(0).width()}) // set to same position in image, except it's another image
				TweenMax.to($('.explore-words .translatable--2'), 1, {x: tr2, ease: Power1.easeOut}) // ease as expected
			}
			else if (tr2<-$('.explore-words .translatable--2 img').eq(0).width())
			{
				tr2 = $('.explore-words .translatable--2 img').eq(0).width()+tr2;
				TweenMax.set($('.explore-words .translatable--2'), {x: $('.explore-words .translatable--2 img').eq(0).width()+$('.explore-words .translatable--2').get(0)._gsTransform.x}) // set to same position in image, except it's another image
			}
		}
		
		TweenMax.to($('.explore-words .translatable--2'), 1, {x: tr2, ease: Power1.easeOut})
		
		TweenMax.to($('.explore-words .translatable--words'), 1, {x: '+='+this.explore_speed/diviser, ease: Power1.easeOut})
	}
	window.requestAnimationFrame(this.onAnimationFrame.bind(this));
}

Page_ExploreWords.prototype.unbindEvents = function() {
	$(document).off('mousemove');
	$('.word').off('click');
	$(document).off('click','.word');
	this.onAnimationFrame = function() {};
	$('.translatable').removeClass('visible');
	$('.explore-words .words').removeClass('visible');
}