var Page_Home = function() {
	this.Vue = new Vue({
		el: '.home',
		data: {}
	});
	
	Page.apply(this, arguments);
}
Page_Home.prototype = Object.create(Page.prototype);

Page_Home.prototype.bindEvents = function () {

   $(document).on('click','#start', function(e) {

			$('#bar').slideDown( "slow", function() {
				$('.circle_border').fadeIn( "slow", function() {
					$('.circle_inside').fadeIn( "slow", function() {
						$('.home .container .explore .hole img').fadeIn( "1000", function() {
						app.goTo('exploreWords');
						return false;
						});
					});
				});
			});
	});

}

Page_Home.prototype.run = function () {

	this.h1text = $('.home h1').text();
	$('.home h1').text('');
	console.log(this.h1text);

    
    //logo
	$(".container > .logo").animate({
		opacity: 1
	}, {
		duration: 500,
		queue: false
	});

	//h3
	$(".container > h3").animate({
		opacity: 1
	}, {
		duration: 1200,
		queue: false
	});
	$(".container > h3").animate({
		"margin-top": "0px"
	}, {
		duration: 600,
		queue: true
	});

	//H1
	$(".container > h1").animate({
		opacity: 1
	}, {
		duration: 1800,
		queue: false
	});
	$(".container > h1").animate({
		"margin-top": "0px"
	}, {
		duration: 1200,
		queue: true
	});

	setTimeout(function () {
		$(".home h1").lbyl({
			content: this.h1text,
			speed: 35
		})
	}.bind(this), 500); 
	//button
	setTimeout(function () {
		$(".bouton").animate({
			opacity: 1,
			"top": 0
		}, {
			duration: 800,
			queue: false
		});
	}, 3000);

	$('.navbar').slideDown("slow", function () {

	});



	/*

	  $('.container > h3').fadeIn( "slow", function() {

			  $('.container > h1').fadeIn( "slow", function() {

					  $('.bouton').fadeIn( "slow", function() {

							$('.navbar').slideDown( "slow", function() {


							});


					});

			  }); 

		});*/

}