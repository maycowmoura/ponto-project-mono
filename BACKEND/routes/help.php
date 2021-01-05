<?php

// $router comes from index.php


$router->post('/help', function () {
  require_once __DIR__ . '/../controllers/help/send-message.php';
});
