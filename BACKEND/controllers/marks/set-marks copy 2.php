<?php

require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/SQL.php';

// INPUT EXAMPLE

// $date variable comes from ROUTER
//
// [{
//   "id": 1004,
//   "mark": {
//     "by": 21321,
//     "last_edition": 23784927384972,
//     "comment": "this is a comment",
//     "time_in": 0,
//     "time_out": 0
//   }
// }]

$date = '2020-10-21';
$input = [
  [
    "id" => 1004,
    "mark" => [
      "by" => 1039,
      "last_edition" => 23784927384972,
      "comment" => "this is a comment",
      "time_in" => 421,
      "time_out" => 1021,
    ],
  ], [
    "id" => 1006,
    "mark" => [
      "by" => 1039,
      "last_edition" => 23784927384972,
      "time_in" => 420,
      "time_out" => 1023,
    ],
  ]];
//
//
//
//
//
//
//
$weekday = date_format(date_create_from_format('Y-m-d', $date), 'w');
$todayTime = time();

$serializedInput = array_map(function ($employer) use ($date, $todayTime, $weekday) {
  $mark = $employer['mark'];

  $result = [
    'employer_id' => $employer['id'],
    'date' => $date,
    'time_in' => $mark['time_in'],
    'time_out' => $mark['time_out'],
    'created_by' => $mark['by'],
    'created_at' => $todayTime,
    'weekday' => $weekday,
  ];

  if (isset($mark['comment'])) {
    $result = array_merge(
      $result, [
        'comment' => $mark['comment'],
        'commented_by' => $mark['by'],
        'commented_at' => $todayTime,
      ]);
  }

  return $result;
}, $input);
//

//

//
function queryBuilder($data) {
  $employerId = $data['employer_id'];
  $time_in = $data['time_in'];
  $time_out = $data['time_out'];
  $fields = implode("`, `", array_keys($data));
  $values = implode("', '", array_values($data));

  $splitted = explode('-', $data['date']);
  $datePattern = "%$splitted[1]-$splitted[2]"; // cria um pattern sem ano, tipo: %12-25

  unset($data['employer_id'], $data['weekday'], $data['date']);
  $dataForUpdate = [];
  foreach ($data as $key => $value) {
    $dataForUpdate[] = "`$key`='$value'";
  }
  $dataForUpdate = implode(', ', $dataForUpdate);

  return (
    "SELECT
      @default_time_in := `time_in`,
      @default_time_out := `time_out`
    FROM
      `rionorte_default-times` as `times`
    INNER JOIN
      `rionorte_employers` as `employer`
    ON times.id = employer.default_time
    WHERE employer.id = '$employerId';

    SET @time_before = IF($time_in > 0, @default_time_in - $time_in, NULL),
      @time_after = IF($time_out > 0, $time_out - @default_time_out, NULL);

    SET @holiday = (SELECT COUNT(*) FROM `rionorte_holidays` WHERE `date` LIKE '$datePattern');

    INSERT INTO `rionorte_marks`
      (`$fields`, `time_before`, `time_after`, `holiday`)
    VALUES
      ('$values', @time_before, @time_after, @holiday)
    ON DUPLICATE KEY UPDATE
      $dataForUpdate, `time_before`=@time_before, `time_after`=@time_after;


      "
  );
}
//
//
//
$queries = array_map(function ($data) {
  return queryBuilder($data);
}, $serializedInput);

$finalQuery = (
  'START TRANSACTION;' .
  implode('', $queries) .
  'COMMIT;'
);

die($finalQuery);

//
//
//
//
$sql = new SQL();
$sql->execute($query);
$result = $sql->getResultArray();
$json = _json_encode($result);

die($json);