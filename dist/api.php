<?php

/*
TODO
- ajouter un mot à une oeuvre

FRONT :
- url
*/

/*
# ROUTES
$app->get    	api/v1/words
$app->get    	api/v1/words/{word}/items

$app->get    	api/v1/user/{user_id}/stars

$app->get    	api/v1/items/{item_id}/similar
$app->put    	api/v1/items/{item_id}/star
$app->delete    api/v1/items/{item_id}/star
$app->get		api/v1/items/{item_id}/words 
$app->put		api/v1/items/{item_id}/words/{new_word}

$app->get    	api/v1/signed_in

$app->post    	api/v1/sign_in

$app->post    	api/v1/sign_out

$app->post    	api/v1/sign_up

$app->get    	api/v1/debug
*/

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

session_start();

require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/../conf/config.php';

$app = new Silex\Application();
$app['debug'] = true;

$app->register(new \Silex\Provider\PDOServiceProvider, array(
  'pdo.dsn'        => 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=UTF8',
  'pdo.username'   => DB_USERNAME,
  'pdo.password'   => DB_PASSWORD,
  'pdo.options' => array(
		PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES UTF8"
	),
));

$app['db']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
$app['db']->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

function get_infos_and_flatten($grouped_items) {
	global $app;
	$grouped_detailed_items = array();
	foreach ($grouped_items as $type => $items)
	{
		$items_id = [];
		foreach ($items as $item)
				$items_id[] = $item['id'];
		
		$items_id_concatenated = implode(',',$items_id);
		
		if (!in_array($type,['photograph','painting','quote','poem'])) continue;
		
		$q = $app['db']->query('
		SELECT *
		FROM ' . ($type.'s') . '
		WHERE item_id IN ( ' . $items_id_concatenated .  ' )');
		
		
		$grouped_detailed_items[$type] = $q->fetchAll();
	}
	
	$flattened_items = array();
	foreach ($grouped_detailed_items as $type => $items)
	{
		foreach ($items as $item)
		{
			$item['id'] = $item['item_id'];
			unset($item['item_id']);
			$flattened_items[] = array_merge($item,array('type' => $type));
		}
	}
	
	return $flattened_items;
}

$app->get('api/v1/words', function () use ($app) { // @todo NODB ? 
	$q = $app['db']->query('SELECT COUNT(item_id) count, word FROM item_words GROUP BY word HAVING count > 3 ORDER BY rand()');
	$results = $q->fetchAll();
	return $app->json(array('words' => $results));
});

$app->get('api/v1/words/{word}/items', function ($word) use ($app) { // @todo NODB ? 
	$q = $app['db']->prepare('
		SELECT items.type, items.id
		FROM items
		INNER JOIN item_words
		ON items.id = item_words.item_id
		WHERE item_words.word = :word');
	$q->execute(array(':word' => $word));
	
	$grouped_items = $q->fetchAll(PDO::FETCH_GROUP); // quote => ... ; painting => ...
	
	$flattened_items = get_infos_and_flatten($grouped_items);
	
	if (!isset($_SESSION['username']))
	{
		foreach ($flattened_items as &$item)
		{
			$item['starred'] = false;
		}
	}
	else
	{
		foreach ($flattened_items as &$item)
		{
			$q = $app['db']->prepare('SELECT * FROM user_stars WHERE user_id = :user_id AND item_id = :item_id');
			$q->execute(array(':user_id' => $_SESSION['user_id'], 'item_id' => $item['id']));

			if ($q->fetch() === false)
				$item['starred'] = false;
			else
				$item['starred'] = true;
		}
	}
	/*	
	==> list of items
	
		{similar: [
			{type: 'painting', extension: 'jpg', id: 32, name: '...},
			{type: 'painting', extension: 'jpg', id: 32, name: '...},
			{type: 'quote', quote: 'alala'}
			]}
	
	*/
	return $app->json(array('items' => $flattened_items));
});

$app->get('api/v1/user/{user_id}/stars', function ($user_id) use ($app) { // @todo NODB ? 
	$q = $app['db']->prepare('
		SELECT items.type, items.id
		FROM items
		INNER JOIN user_stars
		ON items.id = user_stars.item_id
		WHERE user_stars.user_id = :user_id');
	$q->execute(array(':user_id' => $user_id));
	
	$grouped_items = $q->fetchAll(PDO::FETCH_GROUP); // quote => ... ; painting => ...
	
	$flattened_items = get_infos_and_flatten($grouped_items);
	
	$q = $app['db']->prepare('
		SELECT username FROM users WHERE id = :user_id');
	$q->execute(array(':user_id' => $user_id));
	$username = $q->fetch()['username'];
	
	/*	
	==> list of items
	
		{similar: [
			{type: 'painting', extension: 'jpg', id: 32, name: '...},
			{type: 'painting', extension: 'jpg', id: 32, name: '...},
			{type: 'quote', quote: 'alala'}
			]}
	
	*/
	return $app->json(array('items' => $flattened_items, 'username' => $username));
});

$app->get('api/v1/items/{item_id}/similar', function ($item_id) use ($app) { // @todo NODB ? 
	$q = $app['db']->prepare('
		SELECT items.type, items.id, iw.word
        FROM items
        INNER JOIN item_words iw
        ON items.id = iw.item_id
        WHERE iw.word IN(SELECT word FROM item_words iww WHERE iww.item_id=:item_id) AND iw.item_id != :item_idd');
	$q->execute(array(':item_id' => $item_id, ':item_idd' => $item_id));
	
	$grouped_items = $q->fetchAll(PDO::FETCH_GROUP); // quote => ... ; painting => ...
	$flattened_items = get_infos_and_flatten($grouped_items);
	
	if (!isset($_SESSION['username']))
	{
		foreach ($flattened_items as &$item)
		{
			$item['starred'] = false;
		}
	}
	else
	{
		foreach ($flattened_items as &$item)
		{
			$q = $app['db']->prepare('SELECT * FROM user_stars WHERE user_id = :user_id AND item_id = :item_id');
			$q->execute(array(':user_id' => $_SESSION['user_id'], 'item_id' => $item['id']));

			if ($q->fetch() === false)
				$item['starred'] = false;
			else
				$item['starred'] = true;
		}
	}
	
	$q = $app['db']->prepare("
		SELECT name FROM paintings WHERE item_id = :item_id
		UNION
		SELECT name FROM photographs WHERE item_id = :item_id2
		UNION
		SELECT SUBSTRING_INDEX(poem,' ',4) name FROM poems WHERE item_id = :item_id3
		UNION 
		SELECT SUBSTRING_INDEX(quote,' ',4) name FROM quotes WHERE item_id = :item_id4");
	$q->execute(array(':item_id' => $item_id, ':item_id2' => $item_id, ':item_id3' => $item_id, ':item_id4' => $item_id));
	$name = $q->fetch()['name'];
	/*	
	==> list of items
	
		{similar: [
			{type: 'painting', extension: 'jpg', id: 32, name: '...},
			{type: 'painting', extension: 'jpg', id: 32, name: '...},
			{type: 'quote', quote: 'alala'}
			]}
	
	*/
	return $app->json(array('items' => $flattened_items, 'name' => $name));
});

$app->put('api/v1/items/{item_id}/star', function ($item_id) use ($app) { // @todo NODB ?
	
	if (!isset($_SESSION['username']))
		return new Response('Not logged in.',401);
	
	$q = $app['db']->prepare('SELECT * FROM user_stars WHERE user_id = :user_id AND item_id = :item_id');
	$q->execute(array(
		':user_id' => $_SESSION['user_id'],
		':item_id' => $item_id,
	));
	
	if ($q->fetch() === false) // item not starred yet
	{
		$q = $app['db']->prepare('INSERT INTO user_stars VALUES (:user_id, :item_id)');
		$q->execute(array(
			':user_id' => $_SESSION['user_id'],
			':item_id' => $item_id,
		));
	}
	
	return new Response('Star added.',200);
});

$app->delete('api/v1/items/{item_id}/star', function ($item_id) use ($app) { // @todo NODB ?
	
	if (!isset($_SESSION['username']))
		return new Response('Not logged in.',401);
	
	$q = $app['db']->prepare('DELETE FROM user_stars WHERE user_id = :user_id AND item_id = :item_id');
	$q->execute(array(
		':user_id' => $_SESSION['user_id'],
		':item_id' => $item_id,
	));
	
	return new Response('Star deleted.',200);
});

/* get list of words linked to an item with count  */
$app->get('api/v1/items/{item_id}/words ', function ($item_id) use ($app) { // @todo NODB ? 
	$q = $app['db']->prepare('SELECT word, COUNT(*) as count FROM item_words WHERE item_id = :item_id GROUP BY word ORDER BY RAND()');
	$q->execute(array(
			':item_id' => $item_id
		));
	return $app->json(array('words' => $q->fetchAll()));
});

$app->put('api/v1/items/{item_id}/words/{new_word}', function ($item_id, $new_word) use ($app) { 
	
	if (!isset($_SESSION['username']))
		return $app->json(array('added_by' => 0));
	//@todo verify new word is a varchar
	$addeb_by = $_SESSION['user_id'];
	
	//abort if exist
	$q = $app['db']->prepare('SELECT * FROM item_words WHERE item_id = :item_id AND added_by = :user_id');
	$q->execute(array(
			':item_id' => $item_id,
			':user_id'=> $addeb_by
		));
	
	//insert id, word, user_id in item_words
	//$_SESSION[user_id]
	if ($q->fetch() === false) // item not linked yet
	{
	$q = $app['db']->prepare('INSERT INTO item_words VALUES (:item_id, :new_word, :user_id)');
		$q->execute(array(
			':item_id' => $item_id,
			':new_word'=> $new_word,
			':user_id' => $_SESSION['user_id']
		));
	}
	
	return $app->json(array('added_by' => $addeb_by));
});

$app->get('api/v1/signed_in', function () use ($app) { // @todo NODB ? 
	
	if (isset($_SESSION['username']))
	{
		$q = $app['db']->prepare('
		SELECT item_id
		FROM user_stars
		WHERE user_stars.user_id = :user_id');
	$q->execute(array(':user_id' => $_SESSION['user_id']));
	
	$items = $q->fetchAll();
	$item_list = array();

	foreach ($items as $item)
	{
		$item_list[] = $item['item_id'];	
	}
	/*	
	==> list of items
	
		{similar: [
			{type: 'painting', extension: 'jpg', id: 32, name: '...},
			{type: 'painting', extension: 'jpg', id: 32, name: '...},
			{type: 'quote', quote: 'alala'}
			]}
	
	*/
		
		
		return $app->json(array('signed_in' => true,
						'user_id' => $_SESSION['user_id'],
						'username' => $_SESSION['username'],
						'mail' => $_SESSION['mail'],
					    'stars' => $item_list));
	}
	else
		return $app->json(array('signed_in' => false));
});

$app->post('api/v1/sign_in', function (Request $request) use ($app) { // @todo NODB ? 
	$q = $app['db']->prepare('SELECT id, username, mail FROM users WHERE (username = :username OR mail = :mail) AND password = :password');
	$q->execute(array(
		':username' => $request->get('login'),
		':mail' => $request->get('login'),
		':password' => md5(SALT . $request->get('password')),
	));
	
	
	$f = $q->fetch();
	if ($f === false)
		return new Response('Wrong login or password.',401);

	$_SESSION['user_id'] = $f['id'];
	$_SESSION['username'] = $f['username'];
	$_SESSION['mail'] = $f['mail'];
	
	return $app->json(array('username' => $f['username']));
	// return new Response('Signed in.',200);
	
});


$app->post('api/v1/sign_out', function (Request $request) use ($app) { // @todo NODB ?
	session_destroy();
	session_unset();
	return new Response('Signed out.',200);
});

$app->post('api/v1/sign_up', function (Request $request) use ($app) { // @todo NODB ?
	
	if (!filter_var($request->get('mail'), FILTER_VALIDATE_EMAIL))
		return new Response('Invalid mail address.',400);
	else if (strlen($request->get('username')) < 1)
		return new Response('Username too short.',400);
	else if (strlen($request->get('password')) < 4)
		return new Response('Password too short.',400);
	
	$q = $app['db']->prepare('SELECT id, username FROM users WHERE username = :username OR mail = :mail');
	$q->execute(array(
		':username' => $request->get('username'),
		':mail' => $request->get('mail')
	));
	
	if ($q->fetch() !== false)
		return new Response('User already exists.',400);

	$q = $app['db']->prepare('INSERT INTO users(username,mail,password) VALUES(:username,:mail,:password)');
	$q->execute(array(
		':username' => $request->get('username'),
		':mail' => $request->get('mail'),
		':password' => md5(SALT . $request->get('password'))
	));
	
	$_SESSION['user_id'] = $app['db']->lastInsertId();
	$_SESSION['username'] = $request->get('username');
	$_SESSION['mail'] = $request->get('mail');
		
	return new Response('Signed up and signed in.',200);
	
});

$app->get('api/v1/debug', function () use ($app) { // @todo NODB ?
	var_dump($_SESSION);
	return '';
});

$app->run();
