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
require_once __DIR__ . '/../../models/DB/DB.php';



$auth = new Auth();
$auth->mustBeAdmin();
$userId = $auth->userId;
$client = $auth->client;




$db = new DB();
$employersInPlace = $db
  ->from("{$client}_employers")
  ->where('place')->is($placeId)
  ->andWhere('disabled_at')->isNull()
  ->select('id')
  ->all();


$total = count($employersInPlace);
if($total > 0){
  error("Ops... $total funcionários ainda estão neste local. Você precisa transferir todos antes de apagá-lo.");
}




$result = $db->transaction(function ($db) use ($client, $placeId, $userId) {
  $db->from("{$client}_users_accesses")
  ->where('place_id')->is($placeId)
  ->delete();

  return $db
  ->update("{$client}_places")
  ->where('id')->is($placeId)
  ->andWhere('disabled_at')->isNull()
  ->set([
    'disabled_at' => time(),
    'disabled_by' => $userId
  ]);
});


$result || error('Nenhum local deletado.');

die('{"ok": true}');
