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
require_once __DIR__ . '/../../models/DB/DB.php';
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
  error($e->getMessage());
}


$name  = mb_strtoupper(POST['name']);
$job   = mb_strtoupper(POST['job']);
$place = POST['place'];




$db = new DB();

$result = $db->transaction(function ($db) use ($name, $job, $place, $client) {
  $db->insert([
    'name' => $name,
    'job' => $job,
    'place' => $place,
    'default_time' => 1001,
  ])
    ->into("{$client}_employers");

  return $db
    ->from(["{$client}_employers" => 'e'])
    ->where('e.id')->is(fn ($expr) => ( //
      $expr->{'LAST_INSERT_ID()'} //
    ))
    ->join(["{$client}_places" => 'p'], fn ($join) => ( //
      $join->on('e.place', 'p.id') // 
    ))
    ->select([
      'e.id' => 'id',
      'e.name' => 'name',
      'p.name' => 'place',
      'job'
    ])
    ->first();
});



$json = _json_encode($result);

die($json);
