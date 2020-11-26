<?php

require_once __DIR__ . '/../../../models/global.php';
require_once __DIR__ . '/../../../models/SQL.php';


function generateHash($user, $client) {

  $oneDayAhead = time() + (24 * 60 * 60);
  $hash = randomString(15);


  $sql = new SQL();
  $sql->execute(
   "SELECT id FROM `$client-users`
    WHERE id = '$user'"
  );

  if (count($sql->getResultArray()) < 1) {
    error(
      "Seu usuário não localizado.
      Solicite a um admin para verificar."
    );
  }


  $sql->execute(
   "INSERT INTO `temp-hashes`
    (`hash`, `client`, `user_id`, `expires`)
    VALUES
    ('$hash', '$client', '$user', '$oneDayAhead')
    ON DUPLICATE KEY UPDATE
    `hash`='$hash', `expires`='$oneDayAhead'"
  );


  $json = _json_encode([
    'hash' => $hash
  ]);

  die($json);
}
