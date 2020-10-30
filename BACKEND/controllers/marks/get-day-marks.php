<?php

/*
 RECEIVES
 $date comes from index.php router
 
 RETURNS
 the employers marks and comments of especific day
 [{
    "id": "1028",
    "name": "ANDERSON JOSÉ SOARES DE OLIVEIRA",
    "job": "ADMINISTRATIVO",
    "default_time_in": "570",
    "default_time_out": "950",
    "time_in": null,
    "time_out": null,
    "comment": null
  }]
*/



require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/SQL.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;



$auth = new Auth();
$auth->mustBeMarker();
$accessibleEmployers = implode(',', $auth->getAccessibleEmployers());
$client = $auth->client;



$filtersList = $_GET['place-filters'] ?? null;
$sqlFilters = $filtersList ? "AND e.place IN ($filtersList)" : '';

try {
  v::optional(v::stringType()->regex('/^(\d+,?)+$/'))->check($filtersList);

} catch (Exception $e) {
  die('{"error": "' . $e->getMessage() . '"}');
}



$sql = new SQL();
$sql->execute(
  "SELECT
    e.id AS id, 
    e.name AS name, 
    job,
    t.time_in AS default_time_in, 
    t.time_out AS default_time_out,
    m.time_in AS time_in, 
    m.time_out AS time_out, 
    comment
  FROM 
    `$client-employers` AS e
  JOIN 
    `$client-default-times` AS t
  ON 
    t.id = e.default_time
  LEFT JOIN 
    `$client-marks` AS m
  ON 
    e.id = m.employer_id AND m.date = '$date'
  WHERE 
    e.id IN ($accessibleEmployers) $sqlFilters
  ORDER BY 
    e.name ASC"
);


$result = $sql->getResultArray();
$json = _json_encode($result);


die($json);