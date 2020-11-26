<?php

// $router comes from index.php


$router->mount('/places', function () use ($router) {

  $router->get('/', function () {
    require_once __DIR__ . '/../controllers/places/get-places.php';
  });

  $router->post('/', function () {
    require_once __DIR__ . '/../controllers/places/create-place.php';
  });

  $router->put('/(\d+)', function ($placeId) {
    require_once __DIR__ . '/../controllers/places/rename-place.php';
  });

  $router->delete('/(\d+)', function ($placeId) {
    require_once __DIR__ . '/../controllers/places/delete-place.php';
  });
});
