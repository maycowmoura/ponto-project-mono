<?php

/*
 RECEIVES
 {
   "name": "User name",
   "type": "admin", "marker" ou "viewer"
   "places": [1001, 1002, 1003] //places that has access
 }
 
 RETURNS 
 {
   "hash": "o3HQDwl5vUq0HYbOjZIRWUHep76oTH"
 }
*/

require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/DB/DB.php';
require_once __DIR__ . '/../../models/Users.php';

use Respect\Validation\Validator as v;



try {
  v::key('name', v::stringType()->alpha(' ')->length(3, 60))
    ->key('type', v::in(['admin', 'marker', 'viewer']))
    ->key('places', v::arrayType()->each(v::intVal()->positive()))
    ->check(POST);
} catch (Exception $e) {
  error($e->getMessage());;
}





$auth = new Auth();
$auth->mustBeAdmin();



$name = mb_strtoupper(POST['name']);
$type = POST['type'];
$places = POST['places'];

$users = new Users($auth);
$hash = $users->create($name, $type, $places);

$json = _json_encode(['hash' => $hash]);
die($json);
