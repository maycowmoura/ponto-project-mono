<?php

require_once __DIR__ . '/../../../models/global.php';
require_once __DIR__ . '/../../../models/SQL.php';


function generateHash($user, $client) {

  $oneDaysAhead = time() + (24 * 60 * 60);
  $hash = randomString();


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
    ('$hash', '$client', '$user', '$oneDaysAhead')
    ON DUPLICATE KEY UPDATE
    `hash`='$hash', `expires`='$oneDaysAhead'"
  );


  $json = _json_encode([
    'hash' => $hash
  ]);

  die($json);
}
