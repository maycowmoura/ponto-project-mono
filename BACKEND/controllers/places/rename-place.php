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
require_once __DIR__ . '/../../models/DB/DB.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;





try {
  v::key('name', v::stringType()->length(3, 60))->check(PUT);
} catch (Exception $e) {
  error($e->getMessage());
}




$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;
$name = mb_strtoupper(PUT['name']);




$db = new DB();

$updated = $db
  ->update("{$client}_places")
  ->where('id')->is($placeId)
  ->set(['name' => $name]);



$updated || error('Nenhum local afetado.');


$json = _json_encode([
  'id' => $placeId,
  'name' => $name
]);

die($json);
