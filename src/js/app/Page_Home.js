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

          $('.container > h3').fadeIn( "slow", function() {

                  $('.container > h1').fadeIn( "slow", function() {
  
                          $('.bouton').fadeIn( "slow", function() {
              
                                $('aside').slideDown( "slow", function() {

                        
                                });

                    
                        });
             
                  });
          
            });
      });

}