<?php

// $router comes from index.php


$router->get('/stats', function () {
  require_once __DIR__ . '/../controllers/stats/get-stats.php';
});
