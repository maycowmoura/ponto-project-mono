<?php

// $router comes from index.php


$router->mount('/users', function () use ($router) {

  $router->get('/', function () {
    require_once __DIR__ . '/../controllers/users/get-users.php';
  });

  $router->post('/', function () {
    require_once __DIR__ . '/../controllers/users/create-user.php';
  });

  $router->get('/hash/{hash}', function ($hash) {
    require_once __DIR__ . '/../controllers/users/hash/get-token-from-hash.php';
  });

  $router->post('/hash', function () {
    require_once __DIR__ . '/../controllers/users/hash/create-hash.php';
  });
});


