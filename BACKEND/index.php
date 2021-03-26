<?php
ini_set('html_errors', false);
require_once './vendor/autoload.php';


// $url = getenv('DEV_MODE') ? '*' : 'https://maycowmoura.tk';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

define($_SERVER['REQUEST_METHOD'], json_decode(file_get_contents('php://input'), true));

$router = new \Bramus\Router\Router();


require_once __DIR__ . '/routes/dashboard.php';
require_once __DIR__ . '/routes/marks.php';
require_once __DIR__ . '/routes/employers.php';
require_once __DIR__ . '/routes/places.php';
require_once __DIR__ . '/routes/users.php';
require_once __DIR__ . '/routes/closed-dates.php';
require_once __DIR__ . '/routes/stats.php';
require_once __DIR__ . '/routes/help.php';



$router->set404(function () {
  echo (404);
});

$router->run();
