<?php

/*
 RECEIVES
 nothing
 
 RETURNS users array EXCEPT YOURSELF
 [{
   "id": 1234,
   "name" "FULANO DE TAL"
 }]
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
  "SELECT id, name 
  FROM `$client-users`
  WHERE id <> '$userId'"
);

$result = $sql->getResultArray();

$json = _json_encode($result);

die($json);