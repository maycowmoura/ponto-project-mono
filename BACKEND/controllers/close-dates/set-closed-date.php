<?php

/*
 RECEIVES
 the date to close the point
 {
   "date": "2020-11-03"
 }
 
 RETURNS
 {
   "ok": true
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
$time = time();


try {
  v::key('date', v::stringType()->date())->check(POST);
} catch (Exception $e) {
  die(_json_encode([
    'error' => $e->getMessage()
  ]));
}


$date = POST['date'];


$sql = new SQL();
$sql->execute(
 "INSERT INTO `closed-dates` 
 (`client`, `date`, `closed_at`) 
 VALUES('$client', '$date', '$time')
 ON DUPLICATE KEY UPDATE date='$date', closed_at='$time'"
);


die('{"ok": true}');
