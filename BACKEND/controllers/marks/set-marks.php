<?php

/*

RECEIVES
$date variable comes from ROUTER
[{
  "id": 1004,
  "comment": "this is a comment",
  "time_in": 0,
  "time_out": 0
}]
*/



require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/SQL.php';

use Respect\Validation\Validator as v;




$auth = new Auth();
$auth->mustBeMarker();
$userId = $auth->userId;
$client = $auth->client;
$accessibleEmployers = $auth->getAccessibleEmployers();
$weekday = date_format(date_create_from_format('Y-m-d', $date), 'w');
$todayTime = time();




try {
  v::date()->lessThan('now')->setName('data')->check($date);

  foreach (POST as $item) {
    v::key('id', v::intVal()->positive()->in($accessibleEmployers))
      ->key('time_in', v::oneOf(v::equals('missed'), v::intVal()->positive()->lessThan(1439)))
      ->key('time_out', v::oneOf(v::equals('missed'), v::intVal()->positive()->lessThan(1439)))
      ->check($item);
    v::optional(v::stringType()->length(null, 200))->check($item['comment'] ?? null);
  }
} catch (Exception $e) {
  error($e->getMessage());
}



$employersIds = array_map(fn ($employer) => $employer['id'], POST);
$employersIds = implode("','", $employersIds);

$sql = new SQL();
$sql->execute(
  "SELECT
    e.id AS employer_id,
    m.id AS mark_id,
    t.time_in AS default_time_in,
    t.time_out AS default_time_out
  FROM `$client-employers` as e
  JOIN `$client-default-times` as t
  ON t.id = e.default_time
  LEFT JOIN `$client-marks` as m
  ON m.date = '$date' AND m.employer_id = e.id
  WHERE e.id IN ('$employersIds')"
);

$selectResult = $sql->getResultArray();

$serializedMarks = array_reduce($selectResult, function ($all, $mark) {
  $all[$mark['employer_id']] = $mark;
  return $all;
}, []);



$dateWithoutYear = preg_replace('/^\d{4}-/', '', $date); // cria um pattern sem ano, tipo: %12-25
$sql->execute(
  "SELECT id 
  FROM `$client-holidays` 
  WHERE `date` = '$date'  OR `date` = '$dateWithoutYear'"
);
$isHoliday = empty($sql->getResultArray()) ? 0 : 1;




$sql->beginTransaction();
foreach (POST as $employer) {
  [
    'id' => $id,
    'time_in' => $time_in,
    'time_out' => $time_out
  ] = $employer;

  [
    'mark_id' => $mark_id,
    'default_time_in' => $default_time_in,
    'default_time_out' => $default_time_out
  ] = $serializedMarks[$id];

  $missed     = $time_in == 'missed';
  $hasComment = isset($employer['comment']);
  $markExists = !!$mark_id;

  $data = [
    'time_in' => $time_in,
    'time_out' => $time_out,
    'created_by' => $userId,
    'created_at' => $todayTime
  ];


  if ($missed && $isHoliday && !$hasComment) {
    return; // se marcou falta no feriado e não tem comentário, pula esse cara
  }

  if(!$missed){
    $data['time_before'] = $default_time_in - $time_in;
    $data['time_after'] = $time_out - $default_time_out;
  }

  if ($hasComment) {
    $data = array_merge($data, [
      'comment' => trim($employer['comment']),
      'commented_by' => $userId,
      'commented_at' => $todayTime
    ]);
  }

  if ($markExists) {
    $sql->execute(
      "INSERT INTO `$client-marks-history`
      SELECT *
      FROM `$client-marks` 
      WHERE id = '$mark_id';"
    );

    $keys = array_keys($data);
    $values = array_values($data);

    $mapped = array_map(fn ($key, $value) => "`$key` = '$value'", $keys, $values);
    $mapped = implode(', ', $mapped);
    $sql->execute(
      "UPDATE `$client-marks`
      SET $mapped
      WHERE id = '$mark_id';"
    );
    //
    //
  } else {

    // merge data to insert
    $data = array_merge($data, [
      'employer_id' => $id,
      'date' => $date,
      'weekday' => $weekday,
      'holiday' => $isHoliday,
    ]);

    $keys = array_keys($data);
    $keys = implode('`, `', $keys);
    $values = array_values($data);
    $values = implode("', '", $values);

    $sql->execute(
      "INSERT INTO `$client-marks` 
      (`$keys`) VALUES ('$values');"
    );
  }
};

$sql->commit();


die('{"ok": true}');
