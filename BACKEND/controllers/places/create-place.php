<?php

/*
 RECEIVES
 an POST with a json
 {
   "name": "Example of name"
 }
 
 RETURNS
 the inserted place  
 {
   "id": 1234,
   "name": "Place Name",
 }
*/


require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/SQL.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;



$auth = new Auth();
$auth->mustBeAdmin();
$userId = $auth->userId;
$client = $auth->client;


try {
  v::key('name', v::stringType()->length(3, 60))->check(POST);
  
} catch (Exception $e) {
  die(_json_encode([
    'error' => $e->getMessage()
  ]));
}


$name = mb_strtoupper(POST['name']);

$sql = new SQL();
$sql->beginTransaction();
$sql->execute(
  "INSERT INTO `$client-places` 
  (`name`) VALUES ('$name')"
);
$sql->execute(
  "INSERT INTO `$client-users-access` 
  (`user_id`, `place_id`) VALUES ('$userId', LAST_INSERT_ID())"
);
$sql->execute(
  "SELECT LAST_INSERT_ID() AS id FROM `$client-places`"
);
$sql->commit();



$id = $sql->getResultArray()[0]['id'];

$json = _json_encode([
  'id' => $id,
  'name' => $name
]);

die($json);