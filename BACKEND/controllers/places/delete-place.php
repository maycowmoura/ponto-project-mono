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
$time = time();




try {
  $sql = new SQL();
  $sql->execute(
   "SELECT id 
    FROM `{$client}_employers` 
    WHERE place = '$placeId'
    AND disabled_at IS NULL"
  );

  $total = count($sql->getResultArray());
  if($total > 0){
    error("Ops... $total funcionários ainda estão neste local. Você precisa transferir todos antes de apagá-lo.");
  }


  $sql->execute(
   "UPDATE `{$client}_places` 
    SET disabled_at = '$time', disabled_by = '$userId'
    WHERE id = '$placeId'
    AND disabled_at IS NULL"
  );

} catch (Exception $e) {
  error($e->getMessage());
}



if ($sql->getTotalAffected() == 0) {
  die('{"error": "Nenhum local deletado."}');
}


die('{"ok": true}');
