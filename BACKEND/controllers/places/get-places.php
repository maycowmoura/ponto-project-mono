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
require_once __DIR__ . '/../../models/SQL.php';


$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;
$accessiblePlaces = $auth->getAccessiblePlaces();
$accessiblePlaces = implode(',', $accessiblePlaces);


$sql = new SQL();
$sql->execute(
 "SELECT id, name 
  FROM `{$client}_places` 
  WHERE id IN ($accessiblePlaces)
  AND disabled_at IS NULL
  ORDER BY name"
);

$result = $sql->getResultArray();
$json = _json_encode($result);

die($json);
