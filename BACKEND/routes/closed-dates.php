<?php

// $router comes from index.php


$router->mount('/closed-dates', function () use ($router) {

  $router->get('/', function () {
    require_once __DIR__ . '/../controllers/close-dates/get-closed-date.php';
  });

  $router->post('/', function () {
    require_once __DIR__ . '/../controllers/close-dates/set-closed-date.php';
  });
});

