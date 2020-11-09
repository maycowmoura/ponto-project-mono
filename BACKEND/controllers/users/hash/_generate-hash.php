<?php

require_once __DIR__ . '/../../../models/global.php';
require_once __DIR__ . '/../../../models/SQL.php';


function generateHash($user, $client) {

  function randomString($length = 30) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $str = '';
    for ($i = 0; $i < $length; $i++) {
      $str .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $str;
  }


  $twoDaysAhead = time() + (48 * 60 * 60);
  $hash = randomString();


  $sql = new SQL();
  $sql->execute(
   "SELECT id FROM `$client-users`
    WHERE id = '$user'"
  );

  if (count($sql->getResultArray()) < 1) {
    die('{"error": "Usuário não localizado."}');
  }


  $sql->execute(
   "INSERT INTO `temp-hashes`
    (`hash`, `client`, `user_id`, `expires`)
    VALUES
    ('$hash', '$client', '$user', '$twoDaysAhead')
    ON DUPLICATE KEY UPDATE
    `hash`='$hash', `expires`='$twoDaysAhead'"
  );


  $json = _json_encode([
    'hash' => $hash
  ]);

  die($json);
}
