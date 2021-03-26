<?php

/*
 RECEIVES
 nothing
 
 RETURNS users array EXCEPT YOURSELF
 [{
   "id": 1234,
   "name" "FULANO DE TAL"
 }]
*/

require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/Users.php';



$auth = new Auth();
$auth->mustBeAdmin();
$userId = $auth->userId;
$client = $auth->client;


$users = new Users($auth);
$allUsers = $users->getAllExceptMyself($userId);

$json = _json_encode($allUsers);
die($json);