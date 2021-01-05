<?php

/**
 * RECEIVES
 * {
 *   "reason": "issue",
 *   "message": "text of the message"
 * }
 * 
 *
 * RETURNS ok
 *
 */


require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

$possibleReasons = [
  'issue',
  'question',
  'suggestion'
];

/**
 * Validate input data
 *
 */

try {
  v::key('reason', v::stringType()->in($possibleReasons))
    ->key('message', v::stringType())
    ->check(POST);
} catch (Exception $e) {
  error($e->getMessage());
}

$reason = strtoupper(POST['reason']);
$message = filterString(POST['message']);


/**
 * Checks authentication
 *
 */
$auth = new Auth();
$auth->mustBeMarker();
$userId = $auth->userId;
$client = $auth->client;



$guzzle = new Client();
$url = 'https://script.google.com/macros/s/AKfycbyIU-rCYnm6CZxsxoPP1hukZJQnNQzQDioP_CNiOJutp4XCjzQ/exec';
$url = 'https://script.google.com/macros/s/AKfycbxqHG8IQR-8snIxfeocMqz314lJotqqIVznShU/exec';

$html = "
  <p><b>Cliente:</b> $client</p>
  <p><b>Usuário:</b> $userId</p>
  <p><b>Mensagem:</b> $message</p>
";

try {
  $request = $guzzle->post($url, [
    'form_params' => [
      'to' => 'maycowmoura@gmail.com',
      'subject' => "AJUDA MARCAPONTO - $reason",
      'body' => $html
    ],
  ]);

  return _json_decode($request->getBody());
} catch (RequestException $e) {
  error($e->getMessage());
}

die('{"ok": true}');