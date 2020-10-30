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
require_once __DIR__ . '/../../models/SQL.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;


$auth = new Auth();
$accessibleEmployers = $auth->getAccessibleEmployers();
$client = $auth->client;

$from = $_GET['from'] ?? null;
$to = $_GET['to'] ?? null;


try {
  v::stringType()->date()->lessThan('now')->setName('From')->check($from);
  v::stringType()->date()->greaterThan($from)->lessThan('now')->setName('`To`')->check($to);

} catch (Exception $e) {
  die(_json_encode([
    'error' => $e->getMessage()
  ]));
}

if(!in_array($employerId, $accessibleEmployers)){
  die('{"error": "Você não tem acesso a esse funcionário."}');
}



$sql = new SQL();
$sql->execute(
 "SELECT
    `date`,
    `time_in`,
    `time_out`,
    `time_before`,
    `time_after`,
    `holiday`,
    `weekday`,
    `comment`,
    `commented_by`,
    `commented_at`,
    u.name AS `commented_by`,
    u2.name AS `created_by`
  FROM `$client-marks` AS m
  LEFT JOIN `$client-users` AS u
  ON m.commented_by = u.id
  LEFT JOIN `$client-users` AS u2
  ON m.created_by = u2.id
  WHERE
      employer_id = '$employerId' AND(`date` BETWEEN '$from' AND '$to')
  ORDER BY `date` ASC"
);

$marks = $sql->getResultArray();

$serializedMarks = [];
foreach($marks as $mark){
  $date = $mark['date'];
  unset($mark['date']);
  $serializedMarks[$date] = $mark;
}


$currentDate = $from;
$resultMarks = [];
while($currentDate <= $to){
  $resultMarks[$currentDate] = $serializedMarks[$currentDate] ?? null;
  $currentDate = date('Y-m-d', strtotime($currentDate . ' + 1 days'));
}


$json = _json_encode($resultMarks);


die($json);
