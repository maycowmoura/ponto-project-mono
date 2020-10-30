<?php

/*
 RECEIVES
 nothing
 
 RETURNS
 array of employers 
 [{
   "id": 1234,
   "name": "Employer Name",
   "job": "Employer Job",
   "place": "Employer Place"
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
 "SELECT e.id AS id, e.name AS name, job, p.name AS place 
  FROM `$client-employers` AS e
  JOIN `$client-places` AS p
  ON e.place = p.id
  WHERE place IN ($accessiblePlaces)
  ORDER BY e.name"
);

$result = $sql->getResultArray();
$json = _json_encode($result);

die($json);
