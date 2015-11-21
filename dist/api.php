<?php

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

$app->run();
