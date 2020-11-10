<?php

require_once './vendor/autoload.php';

header("access-control-allow-origin:  *, POST, PUT, GET, DELETE, OPTIONS");
define($_SERVER['REQUEST_METHOD'], json_decode(file_get_contents('php://input'), true));



$router = new \Bramus\Router\Router();

$router->get('/init', function () {
  require_once __DIR__ . '/controllers/init/init.php';
});



$router->mount('/marks', function () use ($router) {
  $dateRegex = '\d{4}-\d{2}-\d{2}';

  $router->get("/($dateRegex)", function ($date) {
    require_once __DIR__ . '/controllers/marks/get-day-marks.php';
  });

  $router->get('/list/(\d+)', function ($employerId) {
    require_once __DIR__ . '/controllers/marks/get-employer-period-marks.php';
  });
  
  $router->post("/($dateRegex)", function ($date) {
    require_once __DIR__ . '/controllers/marks/set-marks.php';
  });
});



$router->mount('/employers', function () use ($router) {
  $router->get('/', function () {
    require_once __DIR__ . '/controllers/employers/get-employers.php';
  });

  $router->post('/', function () {
    require_once __DIR__ . '/controllers/employers/create-employer.php';
  });

  // $router->put('/(\d+)', function ($employerId) {
  //   require_once __DIR__ . '/controllers/employers/edit-employer.php';
  // });

  $router->delete('/(\d+)', function ($employerId) {
    require_once __DIR__ . '/controllers/employers/archive-employer.php';
  });

  $router->put('/transfer/(\d+)', function ($employerId) {
    require_once __DIR__ . '/controllers/employers/transfer-employer.php';
  });
});



$router->mount('/places', function () use ($router) {

  $router->get('/', function () {
    require_once __DIR__ . '/controllers/places/get-places.php';
  });

  $router->post('/', function () {
    require_once __DIR__ . '/controllers/places/create-place.php';
  });

  $router->put('/(\d+)', function ($placeId) {
    require_once __DIR__ . '/controllers/places/rename-place.php';
  });

  $router->delete('/(\d+)', function ($placeId) {
    require_once __DIR__ . '/controllers/places/delete-place.php';
  });
});





$router->mount('/users', function () use ($router) {


  $router->post('/', function () {
    require_once __DIR__ . '/controllers/users/create-user.php';
  });

  $router->get('/hash/{hash}', function ($hash) {
    require_once __DIR__ . '/controllers/users/hash/get-token-from-hash.php';
  });

  $router->post('/hash', function () {
    require_once __DIR__ . '/controllers/users/hash/create-hash.php';
  });
});





$router->mount('/closed-dates', function () use ($router) {

  $router->get('/', function () {
    require_once __DIR__ . '/controllers/close-dates/get-closed-date.php';
  });

  $router->post('/', function () {
    require_once __DIR__ . '/controllers/close-dates/set-closed-date.php';
  });
});




$router->set404(function () {
  echo (404);
});

$router->run();
