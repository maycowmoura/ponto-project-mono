<?php

/*
 RECEIVES
 $employerId comes from index.php router
 $_GET['from'] = initial date of period
 $_GET['to'] = last date of period
 
 RETURNS
 the employers marks and comments of period
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
require_once __DIR__ . '/../../models/DB/DB.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;


$from = $_GET['from'] ?? null;
$to = $_GET['to'] ?? null;

try {
  v::stringType()->date()->lessThan($to)->setName('From')->check($from);
  v::stringType()->date()->greaterThan($from)->setName('`To`')->check($to);
} catch (Exception $e) {
  error($e->getMessage());
}

if ((strtotime($to) - strtotime($from)) > (62 * 24 * 60 * 60)) {
  error('Ops... Escolha um período menor que 62 dias.');
}

$today = date('Y-m-d');
if ($to > $today) {
  $to = $today;
}






$auth = new Auth();
$accessibleEmployers = $auth->getAccessibleEmployers();
$client = $auth->client;

if (!in_array($employerId, $accessibleEmployers)) {
  error('Você não tem acesso a esse funcionário.');
}






$db = new DB;
$fromWithoutYear = preg_replace('/^\d{4}-/', '', $from);
$toWithoutYear = preg_replace('/^\d{4}-/', '', $to);

$holidays = $db
  ->from("{$client}_holidays")
  ->where('date')->between($from, $to)
  ->orWhere('date')->between($fromWithoutYear, $toWithoutYear)
  ->select(['date'])
  ->all();

$holidays = array_map(fn ($item) => $item->date, $holidays);


$marks = $db
  ->from(["{$client}_marks" => 'm'])
  ->where('employer_id')->is($employerId)
  ->andWhere('date')->between($from, $to)
  ->leftJoin(["{$client}_users" => 'u'], function ($join) {
    $join->on('m.commented_by', 'u.id');
  })
  ->leftJoin(["{$client}_users" => 'u2'], function ($join) {
    $join->on('m.created_by', 'u2.id');
  })
  ->orderBy('date')
  ->select([
    'date',
    'time_in',
    'time_out',
    'time_before',
    'time_after',
    'holiday',
    'weekday',
    'comment',
    'commented_by',
    'commented_at',
    'u.name' => 'commented_by',
    'u2.name' => 'created_by'
  ])
  ->fetchAssoc()
  ->all();


$serializedMarks = array_reduce($marks, function ($all, $mark) {
  $date = $mark['date'];
  unset($mark['date']);
  $all[$date] = $mark;
  return $all;
}, []);






$currentDate = $from;
$resultMarks = [];
while ($currentDate <= $to) {
  if (isset($serializedMarks[$currentDate])) {
    $resultMarks[$currentDate] = $serializedMarks[$currentDate];
    //
  } else {
    $currentDateWithoutYear = preg_replace('/^\d{4}-/', '', $currentDate);
    $isHoliday = in_array($currentDate, $holidays) || in_array($currentDateWithoutYear, $holidays);
    $weekday = date('w', strtotime($currentDate));
    $resultMarks[$currentDate] = [
      'weekday' => $weekday,
      'holiday' => ($isHoliday ? $isHoliday : null)
    ];
  }

  $currentDate = date('Y-m-d', strtotime($currentDate . ' + 1 days'));
}



$json = _json_encode($resultMarks);
die($json);
