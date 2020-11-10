<?php

/*

RECEIVES
$date variable comes from ROUTER
[{
  "id": 1004,
  "mark": {
    "comment": "this is a comment",
    "time_in": 0,
    "time_out": 0
  }
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
      ->key('mark', v::arrayType())
      ->keyNested('mark.time_in', v::intVal()->positive()->lessThan(1439))
      ->keyNested('mark.time_out', v::intVal()->positive()->lessThan(1439))
      ->check($item);
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



$datePattern = preg_replace('/^\d{4}-/', '%', $date); // cria um pattern sem ano, tipo: %12-25
$sql->execute(
  "SELECT id 
  FROM `$client-holidays` 
  WHERE `date` LIKE '$datePattern'"
);
$isHoliday = empty($sql->getResultArray()) ? 0 : 1;




$sql->beginTransaction();
foreach (POST as $employer) {
  $id         = $employer['id'];
  $select     = $serializedMarks[$id];
  $mark       = $employer['mark'];
  $missed     = $mark['time_in'] == 'missed';
  $hasComment = isset($mark['comment']);
  $markExists = !!$select['mark_id'];
  $mark_id    = $select['mark_id'];

  $data = [
    'time_in' => $mark['time_in'],
    'time_out' => $mark['time_out'],
    'time_before' => !$missed ? $select['default_time_in'] - $mark['time_in'] : null,
    'time_after' => !$missed ? $mark['time_out'] - $select['default_time_out'] : null,
    'created_by' => $userId,
    'created_at' => $todayTime
  ];

  if ($hasComment) {
    $data = array_merge($data, [
      'comment' => $mark['comment'],
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
