<?php

/**
 * RECEIVES
 * the date to close the point
 * {
 *   "date": "2020-11-03"
 * }
 *
 *
 * RETURNS
 * {
 *   "ok": true
 * }
 */


require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/DB/DB.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;

try {
  v::key('date', v::stringType()->date())->check(POST);
} catch (Exception $e) {
  error($e->getMessage());
}




$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;
$time = time();




$db = new DB();

$done = $db
  ->insert([
    'date' => POST['date'],
    'client' => $client,
    'closed_at' => time(),
  ])
  ->onDuplicateKeyUpdate([
    'date' => POST['date'],
    'closed_at' => time(),
  ])
  ->into('closed_dates');


$done || error('Erro inesperado ao inserir a data.');

die('{"ok": true}');
