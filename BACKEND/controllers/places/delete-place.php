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
$client = $auth->client;


$sql = new SQL();
$sql->execute(
 "DELETE FROM `$client-places` 
  WHERE id = '$placeId'"
);


if ($sql->getTotalAffected() == 0) {
  die('{"error": "Nenhum local deletado."}');
}


die('{"ok": true}');
