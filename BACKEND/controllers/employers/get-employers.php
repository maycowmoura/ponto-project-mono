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
require_once __DIR__ . '/../../models/DB/DB.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;


$auth = new Auth();
$auth->mustBeMarker();
$client = $auth->client;
$accessiblePlaces = $auth->getAccessiblePlaces();
$placeFilters = !empty($_GET['place-filters']) ? explode(',', $_GET['place-filters']) : null;


try {
  v::optional(
    v::each(v::intVal()->in($accessiblePlaces))
  )->setName('Place-filters')->check($placeFilters);
  //
} catch (Exception $e) {
  error($e->getMessage());
}





$db = new DB();

$result = $db
  ->from(["{$client}_employers" => 'e'])
  ->where('e.disabled_at')->isNull()
  ->andWhere(function ($group) use ($accessiblePlaces, $placeFilters) {
    $group->where('place')->in($accessiblePlaces);
    $placeFilters && $group->andWhere('place')->in($placeFilters);
  })
  ->join(["{$client}_places" => 'p'], fn ($join) => ( //
    $join->on('e.place', 'p.id') //
  ))
  ->orderBy('e.name')
  ->select([
    'e.id' => 'id',
    'e.name' => 'name',
    'job',
    'e.place' => 'place_id',
    'p.name' => 'place'
  ])
  ->all();



$json = _json_encode($result);

die($json);
