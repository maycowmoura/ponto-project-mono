<?php

/*
 RECEIVES
 $placeId comes from index.php router
 
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
$userId = $auth->userId;
$client = $auth->client;


$sql = new SQL();
$sql->beginTransaction();
$sql->execute(
  "DELETE FROM `$client-users-access` WHERE place_id = '$placeId' AND user_id = '$userId'"
);
$sql->execute(
  "DELETE FROM `$client-places` WHERE id = '$placeId'"
);
$sql->commit();


if ($sql->getTotalAffected() == 0) {
  die('{"error": "Nenhum local deletado."}');
}


die('{"ok": true}');
