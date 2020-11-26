<?php

// $router comes from index.php


$router->mount('/marks', function () use ($router) {
  $dateRegex = '\d{4}-\d{2}-\d{2}';

  $router->get("/($dateRegex)", function ($date) {
    require_once __DIR__ . '/../controllers/marks/get-day-marks.php';
  });

  $router->get('/list/(\d+)', function ($employerId) {
    require_once __DIR__ . '/../controllers/marks/get-employer-period-marks.php';
  });

  $router->get('/list/resume', function () {
    require_once __DIR__ . '/../controllers/marks/get-period-resume.php';
  });

  $router->post("/($dateRegex)", function ($date) {
    require_once __DIR__ . '/../controllers/marks/set-marks.php';
  });
});
