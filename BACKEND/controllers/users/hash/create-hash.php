<?php

/*

CREATES A HASH FOR A EXISTING USER

 RECEIVES
 {
   "user": 1001
 }
 
 RETURNS 
 {
   "hash": "o3HQDwl5vUq0HYbOjZIRWUHep76oTH"
 }
*/

require_once __DIR__ . '/../../../models/global.php';
require_once __DIR__ . '/../../../models/Auth.php';
require_once __DIR__ . '/_generate-hash.php';

use Respect\Validation\Validator as v;



$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;


try {
  v::key('user', v::intVal()->positive())->check(POST);
} catch (Exception $e) {
  die(_json_encode([
    'error' => $e->getMessage()
  ]));
}

generateHash(POST['user'], $client);