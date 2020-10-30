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
      "by" => 1040,
      "last_edition" => 23784927384972,
      "comment" => "this is a comment",
      "time_in" => 420,
      "time_out" => 1020,
    ],
  ], [
    "id" => 1006,
    "mark" => [
      "by" => 1040,
      "last_edition" => 23784927384972,
      "time_in" => 420,
      "time_out" => 1023,
    ],
  ]];







$weekday = date_format(date_create_from_format('Y-m-d', $date), 'w');
$todayTime = time();
$selectQueries = [];
$sql = new SQL();


foreach($input as $employer){
  $id = $employer['id'];
  $selectQueries[] = (
   "SELECT
	    e.id AS user_id,
		  m.id AS mark_id,
      t.time_in AS default_time_in,
      t.time_out AS default_time_out
    FROM
      `rionorte_default-times` as t
    JOIN
      `rionorte_employers` as e
    ON 
      t.id = e.default_time
    LEFT JOIN
      `rionorte_marks` as m
    ON 
      m.date = '$date' AND m.employer_id = '$id'
    WHERE 
      e.id = '$id'"
  );
}


$selectFinalQuery = implode(' UNION ALL ', $selectQueries);

$sql->execute($selectFinalQuery);
$selectResult = $sql->getResultArray();




$splittedDate = explode('-', $date);
$datePattern = "%$splittedDate[1]-$splittedDate[2]"; // cria um pattern sem ano, tipo: %12-25

$isHolidayQuery = (
 "SELECT id 
  FROM `rionorte_holidays` 
  WHERE `date` LIKE '$datePattern'"
);

$sql->execute($isHolidayQuery);
$isHoliday = !empty($sql->getResultArray());





$queries = '';
foreach ($selectResult as $selected) {
  $data = array_values(array_filter($input, function($i) use($selected) { 
    return $i['id'] == $selected['user_id']; 
  }))[0];

  $mark = $data['mark'];
  $missed = $mark['time_in'] == 'missed';

  $data = [
    'employer_id' => $data['id'],
    'date' => $date,
    'weekday' => $weekday,
    'holiday' => $isHoliday,
    'time_in' => $mark['time_in'],
    'time_out' => $mark['time_out'],
    'time_before' => !$missed ? $mark['time_in'] - $selected['default_time_in'] : null,
    'time_after' => !$missed ? $selected['default_time_out'] - $mark['time_out'] : null,
    'created_by' => $mark['by'],
    'created_at' => $todayTime
  ];

  if(isset($mark['comment'])){
    $data = array_merge($data, [
      'comment' => $mark['comment'],
      'commented_by' => $mark['by'],
      'commented_at' => $todayTime
    ]);
  }

  
  if(!$selected['mark_id']){
    $keys = implode('`, `', array_keys($data));
    $values = implode("', '", array_values($data));
    $queries .= "INSERT INTO `rionorte_marks` (`$keys`) VALUES ('$values'); ";
    
  } else {
    $mark_id = $selected['mark_id'];
    $mapped = [];
    
    unset($data['employer_id'], $data['date'], $data['created_at'], $data['weekday'], $data['holiday']);
    foreach($data as $key => $value){
      $mapped[] = "`$key`='$value'";
    }
    $values = implode(', ', $mapped);
    $queries .= "UPDATE `rionorte_marks` SET $values WHERE `id` = '$mark_id'; ";
  }
}

die($queries);
$sql->execute($queries);

die('{"ok": true}');