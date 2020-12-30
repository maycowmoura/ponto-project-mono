<?php

/*
 RECEIVES
 nothing
 
 RETURNS
 array of places  
 [{
   "id": 1234,
   "name": "Place Name",
 }]
*/


require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/DB/DB.php';





$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;
$accessiblePlaces = $auth->getAccessiblePlaces();




$db = new DB;

$result = $db
 ->from("{$client}_places")
 ->where('id')->in($accessiblePlaces)
 ->andWhere('disabled_at')->isNull()
 ->orderBy('name')
 ->select(['id', 'name'])
 ->all();
 

$json = _json_encode($result);

die($json);
