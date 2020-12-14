<?php

/*
 RECEIVES
 $employerId comes from index.php router
 
 RETURNS
 {
   "ok": true
 }
*/


require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/SQL.php';


$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;
$userId = $auth->userId;
$accessibleEmployers = $auth->getAccessibleEmployers();
$time = time();


if (!in_array($employerId, $accessibleEmployers)) {
  die('{"error": "Você não tem acesso a esse funcionário."}');
}


$sql = new SQL();
$sql->execute(
  "UPDATE `$client-employers`
  SET disabled_at = '$time', disabled_by = '$userId'
  WHERE id = '$employerId'"
);


die('{"ok": true}');
