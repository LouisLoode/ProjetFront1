/*define('Pages', function () {
	return {
		render: function (page) {
			switch (page)
			{
				case '':
					break;
				default:
					break;
			nunjucks.render(
				'views/' + page + '.html',
				function (err, res) {
					if (err !== null)
						$('body').html(nunjucks.render('views/404.html'));
					else
						$('body').html(res);
				});
		}
	}
});*/

/*

need router? qui supporte les variables ?
/word/0941
/painting/0941
/poem/0941
/quote/0941
/photograph/0941
/profile/okq
/word/0941/similar

home:
 éxecuter un bout de code
 nunjucks.render avec contexte spécifique
 
profil:
 pareil
 
item:

*/
/*

require(['Pages'], function (Pages) {
*/

if (location.protocol + '//' + location.host + location.pathname == $('base').attr('href'))
	var page = 'home';
else
	var page = ((location.protocol + '//' + location.host + location.pathname).substr($('base').attr('href').length));

console.log(page);
console.log(page.match(new RegExp('profile/(\\d+)')));

var matches;
if (page == 'home')
{
	$('body').html(nunjucks.render('views/home.html')); // nunjucks ou tout sur la même page?
}
else if (matches = page.match(new RegExp('profile/(\\d+)')))
{
	$('body').html(nunjucks.render('views/profile.html', {profile: matches[1]}));
}
else
	alert('no match');
/*});*/
