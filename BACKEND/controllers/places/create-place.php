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
require_once __DIR__ . '/../../models/SQL.php';
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

$sql = new SQL();
$sql->beginTransaction();
$sql->execute(
  "INSERT INTO `{$client}_places` 
  (`name`) VALUES ('$name')"
);


$usersAccesses = POST['users-accesses'];
$usersAccesses[] = $userId;
$usersAccessesQuery = array_map(fn($user) => "('$user', LAST_INSERT_ID())", $usersAccesses);
$usersAccessesQuery = implode(',', $usersAccessesQuery);

$sql->execute(
  "INSERT INTO `{$client}_users_accesses` 
  (`user_id`, `place_id`) VALUES $usersAccessesQuery"
);


$sql->execute(
  "SELECT LAST_INSERT_ID() AS id FROM `{$client}_places`"
);
$sql->commit();



$id = $sql->getResultArray()[0]['id'];

$json = _json_encode([
  'id' => $id,
  'name' => $name
]);

die($json);
