<?php

/*
 RECEIVES
 $employerId comes from index.php router
 place json is with the new place his transfered to
 {
   "place": 1234
 }
 
 RETURNS
 {
   "ok": true
 }
*/


require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/SQL.php';

use Respect\Validation\Validator as v;


try {
  v::key('place', v::numericVal())->check(PUT);
} catch (Exception $e) {
  error($e->getMessage());
}


$auth = new Auth();
$auth->mustBeAdmin();
$userId = $auth->userId;
$client = $auth->client;
$accessiblePlaces = $auth->getAccessiblePlaces();
$accessibleEmployers = $auth->getAccessibleEmployers();
$to_place = PUT['place'];
$date = date('Y-m-d');
$time = time();


if (!in_array($to_place, $accessiblePlaces)) {
  error("Você não tem acesso a esse local.");
}

if (!in_array($employerId, $accessibleEmployers)) {
  error("Você não tem acesso a esse funcionário.");
}

try {
  $sql = new SQL();
  $sql->beginTransaction();
  $sql->execute(
    "SELECT @from_place := place FROM `$client-employers` WHERE id = '$employerId'"
  );
  $sql->execute(
    "INSERT INTO `$client-employers-transfers` 
    (date, employer_id, from_place, to_place, transfered_by, transfered_at) 
    VALUES ('$date', '$employerId', @from_place, '$to_place', '$userId', '$time')"
  );
  $sql->execute(
    "UPDATE `$client-employers`
    SET place = '$to_place'
    WHERE id = '$employerId'"
  );
  $sql->commit();

} catch (Exception $e) {
  error($e->getMessage());
}



die('{"ok": true}');
