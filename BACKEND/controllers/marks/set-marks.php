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
require_once __DIR__ . '/../../models/DB/DB.php';
require_once __DIR__ . '/../../models/Marks.php';
require_once __DIR__ . '/../../vendor/autoload.php';


use Respect\Validation\Validator as v;




$auth = new Auth();
$auth->mustBeMarker();
$userId = $auth->userId;
$client = $auth->client;
$accessibleEmployers = $auth->getAccessibleEmployers();
$weekday = date_format(date_create_from_format('Y-m-d', $date), 'w');



try {
  v::date()->lessThan('now')->setName('data')->check($date);

  foreach (POST as $item) {
    v::key('id', v::intVal()->positive()->in($accessibleEmployers))
      ->key('time_in', v::intVal()->lessThan(1439))
      ->key('time_out', v::intVal()->lessThan(1439))
      ->check($item);
    v::optional(v::stringType()->length(null, 200))->check($item['comment'] ?? null);
  }
} catch (Exception $e) {
  error($e->getMessage());
}

$canAccessEmployers = array_reduce(POST, fn ($all, $employer) => ($all && in_array($employer['id'], $accessibleEmployers)), true);

$canAccessEmployers || error('Você não tem acesso a todos os funcionários que está tentando marcar.');




$db = new DB;

$employers = $db
  ->from(["{$client}_employers" => 'e'])
  ->where('e.id')->in(array_map(fn ($employer) => $employer['id'], POST))
  ->andWhere('e.disabled_at')->isNull()
  ->join(["{$client}_default_times" => 't'], fn ($join) => ( //
    $join->on('t.id', 'e.default_time')
    ->andOn('t.weekday', fn ($expr) => $expr->value($weekday)) //
  )) 
  ->select([
    'e.id' => 'employer_id',
    't.time_in' => 'default_time_in',
    't.time_out' => 'default_time_out'
  ])
  ->fetchAssoc() // para retornar um array que será reduzido abaixo, em vez de objeto
  ->all();


  
$serializedMarks = array_reduce($employers, function ($all, $mark) {
  $all[$mark['employer_id']] = $mark;
  return $all;
}, []);




$Marks = new Marks($client, $date, $userId);

foreach (POST as $employer) {
  $id = $employer['id'];
  $time_in = $employer['time_in'];
  $time_out = $employer['time_out'];
  $default_time_in = $serializedMarks[$id]['default_time_in'];
  $default_time_out = $serializedMarks[$id]['default_time_out'];

  $Marks->setEmployer($id);
  $Marks->setTimes($time_in, $time_out);
  $Marks->setDefaultTimes($default_time_in, $default_time_out);
  $Marks->setComment($employer['comment'] ?? null);
  $Marks->next();
}

$Marks->saveAll();



die('{"ok": true}');
