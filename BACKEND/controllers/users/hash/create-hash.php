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
require_once __DIR__ . '/../../../models/Users.php';
require_once __DIR__ . '/../../../vendor/autoload.php';

use Respect\Validation\Validator as v;



$auth = new Auth();
$auth->mustBeAdmin();


try {
  v::key('user', v::intVal()->positive())->check(POST);
} catch (Exception $e) {
  error($e->getMessage());
}

$users = new Users($auth);
$hash = $users->generateHash(POST['user']);

$json = _json_encode(['hash' => $hash]);
die($json);