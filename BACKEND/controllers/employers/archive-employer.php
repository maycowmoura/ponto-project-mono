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
$accessibleEmployers = $auth->getAccessibleEmployers();
$time = time();


if (!in_array($employerId, $accessibleEmployers)) {
  die('{"error": "Você não tem acesso a esse funcionário."}');
}


$sql = new SQL();
$sql->beginTransaction();
$sql->execute(
  "INSERT INTO `$client-archived-employers`
  SELECT *, '$time' AS archived_at 
  FROM `$client-employers` 
  WHERE id = '$employerId'"
);
$sql->execute("SET FOREIGN_KEY_CHECKS=0");
$sql->execute("DELETE FROM `$client-employers` WHERE id = '$employerId'");
$sql->execute("SET FOREIGN_KEY_CHECKS=1"); // isso só vale nessa query, mas reativa só por precaução
$sql->commit();



die('{"ok": true}');
