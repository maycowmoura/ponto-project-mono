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
require_once __DIR__ . '/../../models/SQL.php';
require_once __DIR__ . '/_generate-hash.php';

use Respect\Validation\Validator as v;




$auth = new Auth();
$auth->mustBeAdmin();
$userId = $auth->userId;
$client = $auth->client;
$time = time();


try {
  v::key('name', v::stringType()->alpha(' ')->length(3, 60))
    ->key('type', v::in(['admin', 'marker', 'viewer']))
    ->key('places', v::arrayType()->each(v::intVal()->positive()))
    ->check(POST);
} catch (Exception $e) {
  die(_json_encode([
    'error' => $e->getMessage()
  ]));
}


$name = mb_strtoupper(POST['name']);
$type = POST['type'];
$places = POST['places'];



$sql = new SQL();
$sql->beginTransaction();
$sql->execute(
  "INSERT INTO `$client-users`
  (name, user_type, created_by, created_at)
  VALUES
  ('$name', '$type', '$userId', '$time')"
);
$sql->execute(
  "SELECT LAST_INSERT_ID() AS id FROM `$client-users`"
);

$newUserId = $sql->getResultArray()[0]['id'];
$placesValues = array_map(fn ($place) => "('$newUserId', '$place')", $places);
$placesValues = implode(',', $placesValues);

$sql->execute(
  "INSERT INTO `$client-users-accesses`
  (user_id, place_id)
  VALUES $placesValues"
);
$sql->commit();


generateHash($newUserId, $client);
