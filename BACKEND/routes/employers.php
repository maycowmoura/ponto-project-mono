<?php

// $router comes from index.php


$router->mount('/employers', function () use ($router) {
  $router->get('/', function () {
    require_once __DIR__ . '/../controllers/employers/get-employers.php';
  });

  $router->post('/', function () {
    require_once __DIR__ . '/../controllers/employers/create-employer.php';
  });

  // $router->put('/(\d+)', function ($employerId) {
  //   require_once __DIR__ . '/../controllers/employers/edit-employer.php';
  // });

  $router->delete('/(\d+)', function ($employerId) {
    require_once __DIR__ . '/../controllers/employers/archive-employer.php';
  });

  $router->put('/transfer/(\d+)', function ($employerId) {
    require_once __DIR__ . '/../controllers/employers/transfer-employer.php';
  });
});