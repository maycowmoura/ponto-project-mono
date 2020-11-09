<?php

/*
 RECEIVES
 $hash comes from index.php router
 
 RETURNS 
 {
   "token": "nd9hj2389dj2jd02jd802nf3.023uf2jfjf23f2jf03.098u3f23fh"
 }
*/

require_once __DIR__ . '/../../../models/global.php';
require_once __DIR__ . '/../../../models/Auth.php';
require_once __DIR__ . '/../../../models/SQL.php';



$sql = new SQL();
$sql->execute(
 "SELECT client, user_id, expires
  FROM `temp-hashes` 
  WHERE `hash` = '$hash'"
);

$result = $sql->getResultArray();

if(count($result) < 1){
  die('{"error": "Hash de acesso não encontrada."}');
}

// deleta essa hash acessada e aproveita pra deletar outras hashes expiradas
$time = time();
$sql->execute(
 "DELETE FROM `temp-hashes` 
  WHERE `hash` = '$hash' OR `expires` < '$time'"
);


$userId = $result[0]['user_id'];
$client = $result[0]['client'];
$expires = $result[0]['expires'];

if($expires < time()){
  die('{"error": "Hash de acesso expirada."}');
}

$sql->execute(
 "SELECT id
  FROM `$client-users` 
  WHERE id = '$userId'"
);

if (count($sql->getResultArray()) < 1) {
  die('{"error": "Usuário não localizado."}');
}

$auth = new Auth(false);
$token = $auth->createToken([
  'client' => $client,
  'user' => $userId,
  'exp' => time() + (14 * 24 * 60 * 60) // cria um token que expira em 2 semanas
]);



$json = _json_encode([
  'token' => $token
]);

die($json);
