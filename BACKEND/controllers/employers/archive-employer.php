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
require_once __DIR__ . '/../../models/DB/DB.php';


$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;
$userId = $auth->userId;
$accessibleEmployers = $auth->getAccessibleEmployers();


if (!in_array($employerId, $accessibleEmployers)) {
  die('{"error": "Você não tem acesso a esse funcionário."}');
}




$db = new DB();

$updated = $db
  ->update("{$client}_employers")
  ->where('id')->is($employerId)
  ->set([
    'disabled_at' => time(),
    'disabled_by' => $userId
  ]);


$updated || error('Erro inesperado ao arquivar o funcionário.');

die('{"ok": true}');
