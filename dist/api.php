<?php

/*
# ROUTES
GET words
GET words/joie/items
PUT items/23/star
POST sign_in
*/

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

session_start();

require_once __DIR__.'/../vendor/autoload.php';
require_once __DIR__.'/../conf/config.php';

$app = new Silex\Application();
$app['debug'] = true;

$app->register(new \Silex\Provider\PDOServiceProvider, array(
  'pdo.dsn'        => 'mysql:host=141.138.157.211;dbname=words;charset=UTF8',
  'pdo.username'   => DB_USERNAME,
  'pdo.password'   => DB_PASSWORD,
  'pdo.options' => array(
		PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES UTF8"
	),
));

$app['db']->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
$app['db']->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

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
			$flattened_items[] = array_merge($item,array('type' => $type));
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

$app->get('api/v1/signed_in', function () use ($app) { // @todo NODB ? 
	
	if (isset($_SESSION['username']))
		return $app->json(array('signed_in' => true,
						'user_id' => $_SESSION['user_id'],
						'username' => $_SESSION['username'],
						'mail' => $_SESSION['mail']));
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
