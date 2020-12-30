<?php

require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/DB/DB.php';

$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;
$accessiblePlaces = $auth->getAccessiblePlaces();




$db = new DB();

$employers = $db
  ->from(["{$client}_employers" => 'e'])
  ->where('e.place')->in($accessiblePlaces)
  ->where('e.disabled_at')->isNull()
  ->join(["{$client}_places" => 'p'], fn ($join) => $join->on('p.id', 'e.place'))
  ->orderBy('e.name')
  ->select([
    'e.id' => 'id',
    'e.name' => 'name',
    'e.job' => 'job',
    'e.place' => 'place_id',
    'p.name' => 'place',
  ])
  ->all();


$places = $db
  ->from("{$client}_places")
  ->where('id')->in($accessiblePlaces)
  ->where('disabled_at')->isNull()
  ->orderBy('name')
  ->select(['id', 'name'])
  ->all();


$result = [
  'employers' => $employers,
  'places' => $places,
];


$json = _json_encode($result);

die($json);
