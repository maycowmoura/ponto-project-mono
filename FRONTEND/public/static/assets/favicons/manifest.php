<?php

header('content-type: application/json; charset=utf-8');


$manifest = file_get_contents(__DIR__ . '/manifest.json');
$manifest = json_decode($manifest, true);

if(isset($_GET['ios_token'])){
  $manifest['start_url'] = '/novoponto/#ios_token=' . $_GET['ios_token'];
}

$manifest = json_encode($manifest, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);

die($manifest);


