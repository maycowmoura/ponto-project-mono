<?php

require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/SQL.php';

$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;
$accessiblePlaces = $auth->getAccessiblePlaces();
$accessiblePlaces = implode(',', $accessiblePlaces);



$employersQuery = (
  "SELECT
    e.id AS `id`,
    e.name AS `name`,
    e.job AS `job`,
    e.place AS `place_id`,
    p.name AS `place`
  FROM `$client-employers` AS e
  JOIN `$client-places` AS p
  ON p.id = e.place
  WHERE e.place IN ($accessiblePlaces)
    AND e.disabled_at IS NULL 
  ORDER BY e.name"
);

$placesQuery = (
  "SELECT `id`, `name`
  FROM `$client-places` AS p
  WHERE id IN ($accessiblePlaces)
    AND p.disabled_at IS NULL 
  ORDER BY name"
);


$sql = new SQL();
$sql->execute($employersQuery);
$employers = $sql->getResultArray();

$sql->execute($placesQuery);
$places = $sql->getResultArray();

$result = [
  'employers' => $employers,
  'places' => $places,
];


$json = _json_encode($result);
die($json);