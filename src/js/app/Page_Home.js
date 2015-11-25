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
           
                $('#barre').slideDown( "slow", function() {
                    $('.circle_border').fadeIn( "slow", function() {
                        $('.circle_inside').fadeIn( "slow", function() {
                            $('.home .container .explorer .trou img').fadeIn( "1000", function() {
                            app.goTo('exploreWords');
                            return false;
                            });
                        });
                    });
                });
		});


}

Page_Home.prototype.run = function () {

      $( document ).ready(function() {
          
          $(function () {
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
              
              //button
            $(".bouton").animate({
                opacity: 1
            }, {
                duration: 2400,
                queue: false
            });
            $(".bouton").animate({
                "margin-top": "0px"
            }, {
                duration: 1800,
                specialEasing: {
                    "margin-top": "easeOutCirc"
                },
                queue: true
            });
              
            $('.navbar').slideDown( "slow", function() {
                
            });
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
      });

}