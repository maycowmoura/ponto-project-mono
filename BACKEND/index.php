<?php

require_once './vendor/autoload.php';

define($_SERVER['REQUEST_METHOD'], _json_decode(file_get_contents('php://input')));

$router = new \Bramus\Router\Router();


$router->mount('/envio', function () use ($router) {

  $router->get('/{client}', function ($client) {
    require_once './controllers/envio/get-document-list.php';
  });

});

$router->set404(function () {
  echo (404);
});

$router->run();
