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
$time = time();


$sql = new SQL();
$sql->beginTransaction();
$sql->execute(
 "INSERT INTO `$client-archived-employers`
  SELECT *, '$time' AS archived_at 
  FROM `$client-employers` 
  WHERE id = '$employerId'"
);
$sql->execute(
  "DELETE FROM `$client-s` WHERE id = '$employerId'"
);
$sql->commit();



if ($sql->getTotalAffected() == 0) {
  die('{"error": "Nenhum funcionário afetado."}');
}


die('{"ok": true}');
