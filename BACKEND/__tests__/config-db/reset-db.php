<?php

require_once __DIR__ . '/../../models/global.php';

$sql = file_get_contents(__DIR__ . '/teste-db.sql');

$mysqli = new mysqli(
  "localhost",
  CONFIG['db-user'],
  CONFIG['db-password'],
  CONFIG['db-name']
);

$result = $mysqli->multi_query($sql);

die('{"ok": true}');
