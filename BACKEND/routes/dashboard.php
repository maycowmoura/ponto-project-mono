<?php

// $router comes from index.php


$router->get('/dashboard', function () {
  require_once __DIR__ . '/../controllers/dashboard/dashboard.php';
});
