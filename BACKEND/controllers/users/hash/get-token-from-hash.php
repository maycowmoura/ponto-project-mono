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
require_once __DIR__ . '/../../../models/DB/DB.php';
require_once __DIR__ . '/../../../models/Users.php';
require_once __DIR__ . '/../../../vendor/autoload.php';


use Respect\Validation\Validator as v;


try {
  v::stringVal()->regex('/[a-z0-9]{15}/i')->setName('hash')->check($hash);
} catch (Exception $e) {
  error($e->getMessage());
}





$db = new DB;

$hashData = $db
  ->from('temp_hashes')
  ->where('hash')->is($hash)
  ->select(['client', 'user_id', 'expires'])
  ->first();

$hashData || error(
  "Hash inválida!
  Cada link de acesso só pode ser acessado uma única vez.
  Solicite outro link ao admin do sistema."
);



$wasDeleted = $db
  ->from('temp_hashes')
  ->where('hash')->is($hash)
  ->orWhere('expires')->lessThan(time())
  ->delete();

$wasDeleted || error('Erro inesperado ao deletar o código do banco.');



($hashData->expires < time()) && error(
  "Acesso expirada.
  Cada link de acesso tem duração de 24hrs após ser gerado."
);



$users = new Users();
$users->client = $hashData->client;
$user = $users->getSingleUser($hashData->user_id);



$auth = new Auth(false);

$token = $auth->createToken([
  'client' => $hashData->client,
  'user' => $user->id,
  'typ' => $user->user_type,
  'refresh' => $user->refresh_token,
  'exp' => time() + (60 * 60) // cria um token que expira em 1h
]);



$json = _json_encode([
  'token' => $token
]);

die($json);
