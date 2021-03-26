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
    "place_id": 1234,
    "default_time_in": "570",
    "default_time_out": "950",
    "time_in": null,
    "time_out": null,
    "comment": null
  }]
*/



require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/DB/DB.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;


$placeFilters = !empty($_GET['place-filters']) ? explode(',', $_GET['place-filters']) : null;

try {
  v::optional(
    v::each(v::intVal()->positive())
  )->setName('Place-filters')->check($placeFilters);
  //
} catch (Exception $e) {
  error($e->getMessage());
}






$auth = new Auth();
$auth->mustBeMarker();
$accessibleEmployers = $auth->getAccessibleEmployers();
$client = $auth->client;
$weekday = date('w', strtotime($date));







$db = new DB();

$closedDate = $db
  ->from("closed_dates")
  ->where('client')->is($client)
  ->select()
  ->first();


if ($closedDate) {
  $formated = implode('/', array_reverse(explode('-', $closedDate->date)));

  if ($date <= $closedDate->date) {
    error(
      "Ops... O ponto foi fechado em $formated, não é permitido alterar datas antes disso.
      Toque para voltar."
    );
  }
}


$result = $db
  ->from(["{$client}_employers" => 'e'])
  ->where(function ($group) use ($accessibleEmployers, $placeFilters) {
    $group->where('e.id')->in($accessibleEmployers)
      ->andWhere('e.disabled_at')->isNull();
    $placeFilters && $group->andWhere('e.place')->in($placeFilters);
  })
  ->leftJoin(["{$client}_marks" => 'm'], fn ($join) => ( //
    $join->on('e.id', 'm.employer_id')
    ->andOn('m.date', fn ($expr) => $expr->value($date)) //
  ))
  ->leftJoin(["{$client}_default_times" => 't'], fn ($join) => ( //
    $join->on('t.id', 'e.default_time')
    ->andOn('t.weekday', fn ($expr) => $expr->value($weekday)) //
  ))
  ->orderBy('e.name')
  ->select([
    'e.id' => 'id',
    'e.name' => 'name',
    'e.place' => 'place_id',
    'job',
    'comment',
    't.time_in' => 'default_time_in',
    't.time_out' => 'default_time_out',
    'm.time_in' => 'time_in',
    'm.time_out' => 'time_out',
  ])
  ->all();


// foreach ($db->getLog() as $log) {
//   echo $log['query'] . '<br><br>';
// }

$json = _json_encode($result);
die($json);
