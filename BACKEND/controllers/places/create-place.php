<?php

/*
 RECEIVES
 an POST with a json
 {
   "name": "Example of name",
   "users-accesses": [1001, 1002]
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
require_once __DIR__ . '/../../models/DB/DB.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;


try {
  v::key('name', v::stringType()->length(3, 60))->check(POST);
  v::optional(
    v::arrayType()->each(v::numericVal()->positive())
  )->check(POST['users-accesses'] ?? null);
} catch (Exception $e) {
  error($e->getMessage());
}



$auth = new Auth();
$auth->mustBeAdmin();
$userId = $auth->userId;
$client = $auth->client;
$name = mb_strtoupper(POST['name']);




$db = new DB();

$resultPlaceId = $db->transaction(function ($db) use ($client, $name, $userId) {
  $db->insert(['name' => $name])
    ->into("{$client}_places");

  $placeId = $db->getConnection()->getPDO()->lastInsertId();

  $userAccesses = [...POST['users-accesses'], $userId];

  foreach($userAccesses as $user){
    $db->insert([
      'user_id' => $user,
      'place_id' => $placeId
    ])->into("{$client}_users_accesses");
  }

  return $placeId;
});




$json = _json_encode([
  'id' => $resultPlaceId,
  'name' => $name
]);

die($json);
