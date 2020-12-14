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
   "place_id": 1234
   "place": "Employer Place"
 }]
*/


require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/SQL.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;


$auth = new Auth();
$auth->mustBeMarker();
$client = $auth->client;
$accessiblePlaces = $auth->getAccessiblePlaces();
$accessiblePlaces = implode(',', $accessiblePlaces);



$filtersList = $_GET['place-filters'] ?? null;
$sqlFilters = $filtersList ? "AND e.place IN ($filtersList)" : '';

try {
  v::optional(v::stringType()->regex('/^(\d+,?)+$/'))->check($filtersList);
} catch (Exception $e) {
  error($e->getMessage());
}




$sql = new SQL();
$sql->execute(
 "SELECT e.id AS id, e.name AS name, job, e.place AS place_id, p.name AS place 
  FROM `$client-employers` AS e
  JOIN `$client-places` AS p
  ON e.place = p.id
  WHERE place IN ($accessiblePlaces) 
    AND e.disabled_at IS NULL 
    $sqlFilters
  ORDER BY e.name"
);

$result = $sql->getResultArray();
$json = _json_encode($result);

die($json);
