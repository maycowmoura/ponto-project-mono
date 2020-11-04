<?php

/*
 RECEIVES
 nothing, $client will be received by token
 
 RETURNS
 {
   "date": "2020-11-03"
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
 "SELECT `date` 
  FROM `closed-dates` 
  WHERE client = '$client'"
);


$result = $sql->getResultArray();

if(count($result) < 1){
  die('{"date": null}');
}


$json = _json_encode($result[0]);

die($json);



