<?php

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();
$app['debug'] = true;

$app->get('api/v1/items', function () use ($app) {
	return '(json api)';
});

$app->run();
