<?php


date_default_timezone_set('America/Sao_Paulo');

define('CONFIG', json_decode(file_get_contents(__DIR__ . '/../config/' . (getenv('DEV_MODE') ? 'dev' : 'prod') . '.json'), true));


if (!getenv('DEV_MODE')) {

  header('content-type: application/json; charset=utf-8');
  
  set_exception_handler(function ($e) {
    return error($e->getMessage());
  });

  set_error_handler(function ($n, $errstr, $f, $errline) {
    return error($errstr, $errline);
  });

}

function error($errstr, $errline = null) {
  $line = $errline ? $errline . ': ' : '';
  die(_json_encode([
    'error' => $line . $errstr
  ]));
};

function _json_encode($array) {
  return json_encode($array, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
}

function _json_decode($string) {
  return json_decode($string, true);
}

function filterString($string){
  return filter_var(addslashes($string), FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_BACKTICK);
}


function randomString($length = 30) {
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $str = '';
  for ($i = 0; $i < $length; $i++) {
    $str .= $characters[rand(0, strlen($characters) - 1)];
  }
  return $str;
}
