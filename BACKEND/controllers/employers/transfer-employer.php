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


$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;
$accessibleEmployers = $auth->getAccessibleEmployers();

if (!in_array($employerId, $accessibleEmployers)) {
  die('{"error": "Você não tem acesso a esse funcionário."}');
}



try {
  v::key('place', v::numericVal())->check(PUT);
} catch (Exception $e) {
  die(_json_encode([
    'error' => $e->getMessage()
  ]));
}


$place = PUT['place'];

try {
  $sql = new SQL();
  $sql->execute(
   "UPDATE `$client-employers`
    SET place = '$place'
    WHERE id = '$employerId'"
  );

} catch (Exception $e) {
  $message = $e->getMessage();
  $message = strpos($message, ' 23000 ') > 0 ? 'Local de destino não encontrado.' : $message;

  die(_json_encode([
    'error' => $message
  ]));
}



if ($sql->getTotalAffected() == 0) {
  die('{"error": "Nenhum funcionário afetado."}');
}


die('{"ok": true}');
