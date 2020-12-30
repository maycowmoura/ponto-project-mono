<?php

/*
 RECEIVES
 $employerId comes from index.php router
 place json is with the new place his transfered to
 {
   "place": 1234
 }
 
 RETURNS
 {
   "ok": true
 }
*/


require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/DB/DB.php';

use Respect\Validation\Validator as v;


try {
  v::key('place', v::numericVal())->check(PUT);
} catch (Exception $e) {
  error($e->getMessage());
}


$auth = new Auth();
$auth->mustBeAdmin();
$userId = $auth->userId;
$client = $auth->client;
$to_place = PUT['place'];


if (!in_array($to_place, $auth->getAccessiblePlaces())) {
  error("Você não tem acesso a esse local.");
}

if (!in_array($employerId, $auth->getAccessibleEmployers())) {
  error("Você não tem acesso a esse funcionário.");
}





$db = new DB();

$result = $db->transaction(function ($db) use ($employerId, $client, $to_place, $userId) {
  $from = $db
    ->from("{$client}_employers")
    ->where('id')->is($employerId)
    ->select('place')
    ->first()
    ->place;

  $db->insert([
    'employer_id' => $employerId,
    'from_place' => $from,
    'to_place' => $to_place,
    'transfered_by' => $userId,
    'transfered_at' => time()
  ])->into("{$client}_employers_transfers");

  return $db
    ->update("{$client}_employers")
    ->where('id')->is($employerId)
    ->set(['place' => $to_place]);
});



$result || error('Erro inesperado ao inserir a data.');

die('{"ok": true}');
