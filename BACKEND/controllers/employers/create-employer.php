<?php

/*
 RECEIVES
 an POST with a json
 {
   "name": "Example of name",
   "job": "Eletricista",
   "place" 1234
 }
 
 RETURNS
 the inserted place  
 {
   "id": 1234,
   "name": "Employer Name",
   "job": "Employer Job",
   "place": "Employer Place"
 }
*/


require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/SQL.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;



$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;


try {
  v::key('name', v::stringType()->alpha(' ')->length(3, 60))
    ->key('job', v::stringType()->length(3, 60))
    ->key('place', v::intVal()->positive())->check(POST);

} catch (Exception $e) {
  die($e->getMessage());
}


$name  = mb_strtoupper(POST['name']);
$job   = mb_strtoupper(POST['job']);
$place = POST['place'];

$sql = new SQL();
$sql->beginTransaction();
$sql->execute(
  "INSERT INTO `$client-employers`
  (name, job, place, default_time)
  VALUES
  ('$name', '$job', '$place', 1001)"
);
$sql->execute(
 "SELECT e.id AS id, e.name AS name, p.name AS place, job
  FROM `$client-employers` AS e
  JOIN `$client-places` AS p
  ON e.place = p.id
  WHERE e.id = LAST_INSERT_ID()"
);
$sql->commit();


$result = $sql->getResultArray();
$json = _json_encode($result[0]);

die($json);
