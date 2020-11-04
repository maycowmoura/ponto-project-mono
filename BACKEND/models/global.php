<?php
//
// HEADERS
//

// header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");
date_default_timezone_set('America/Sao_Paulo');

// defines the PRODUCTION constant for use in tests for localhost and production
define('PRODUCTION', 
  isset($_SERVER['REMOTE_ADDR'])
  ? !in_array($_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1'])
  : !substr(php_uname(), 0, 7) == "Windows"
);


//
// FUNCTIONS
//

set_exception_handler(function($e){
    return error($e->getMessage());
});

set_error_handler(function($n, $errstr, $f, $errline){
    return error($errstr, $errline);
});

function error($errstr, $errline = null){
    $line = $errline ? $errline . ': ' : '';
    die('{"error": "'.$line.$errstr.'"}');
};

function _json_encode($array){
    return json_encode($array, JSON_UNESCAPED_UNICODE);
}

function _json_decode($string){
    return json_decode($string, true);
}



// ############### IMPORTANTE ##################
// para funcionar a função exec() do PHP deve estar habilitada
// ela geralmente vem desabilitada por padrão, verifique nas configurações do php
function execInBackground($script){
    if (substr(php_uname(), 0, 7) == "Windows") {
        $phpExePath = str_replace('ext/', 'php.exe', ini_get('extension_dir'));

        if (!function_exists('popen')) throw new Exception('A FUNÇÃO popen() DO PHP DEVE ESTAR HABILITADA!!!!');
        pclose(popen("start $phpExePath $script", "r"));
        
    } else {
        if(!function_exists('exec')) throw new Exception('A FUNÇÃO exec() DO PHP DEVE ESTAR HABILITADA!!!!');
        exec("php $script > /dev/null &");
    }
}


function deleteDir($dir) {
  $it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
  $files = new RecursiveIteratorIterator(
    $it,
    RecursiveIteratorIterator::CHILD_FIRST
  );
  foreach ($files as $file) {
    if ($file->isDir()) {
      rmdir($file->getRealPath());
    } else {
      unlink($file->getRealPath());
    }
  }
  rmdir($dir);
}