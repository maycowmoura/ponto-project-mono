<?php

/*
 RECEIVES
 an PUT with a json and $placeId comes from index.php router
 {
   "name": "Example of name"
 }
 
 RETURNS
 the renamed place  
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
$client = $auth->client;


try {
  v::key('name', v::stringType()->length(3, 60))->check(PUT);
} catch (Exception $e) {
  die($e->getMessage());
}


$name = mb_strtoupper(PUT['name']);

$sql = new SQL();
$sql->execute(
 "UPDATE `$client-places` 
  SET `name`='$name' 
  WHERE id = '$placeId'"
);


if ($sql->getTotalAffected() == 0) {
  die('{"error": "Nenhum local afetado."}');
}


$json = _json_encode([
  'id' => $placeId,
  'name' => $name
]);

die($json);
