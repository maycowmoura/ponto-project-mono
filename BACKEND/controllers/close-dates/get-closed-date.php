<?php

/**
 *  RECEIVES
 *  nothing, $client will be received by token
 *
 *  RETURNS
 *  {
 *     "date": "2020-11-03"
 *  }
 */


require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/DB/DB.php';



$auth = new Auth();
$auth->mustBeAdmin();
$client = $auth->client;


$db = new DB();

$result = $db
  ->from('closed_dates')
  ->where('client')->is($client)
  ->select('date')
  ->first();


if (!$result) {
  die('{"date": null}');
}


$json = _json_encode($result);

die($json);
