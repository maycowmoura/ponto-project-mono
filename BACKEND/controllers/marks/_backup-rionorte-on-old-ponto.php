<?php

/*
RECEIVES

$date variable and $userId comes from set-marks.php

POST constant:
[{
  "id": 1004,
  "comment": "this is a comment",
  "time_in": 0,
  "time_out": 0
}]
*/


require_once __DIR__ . '/../../vendor/autoload.php';

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;




function MinutesToFormatedTime($minutes) {
  $addZero = fn ($num) => $num <= 9 ? '0' . $num : $num;

  $hour = $addZero(intval($minutes / 60));
  $min = $addZero(intval($minutes % 60));
  return $hour . ':' . $min . 'h';
}


$serializedMarksForOldPonto = array_reduce(POST, function ($all, $mark) {
  $all[$mark['id']] = [
    'in' => MinutesToFormatedTime($mark['time_in']),
    'out' => MinutesToFormatedTime($mark['time_out']),
    'comment' => $marks['comment'] ?? ''
  ];

  return $all;
}, []);


$guzzle = new Client();

try {
  $splitted = explode('-', $date);
  $monthYear = $splitted[0] . '-' . $splitted[1];
  $day = $splitted[2];

  $request = $guzzle->post("https://www.maycowmoura.tk/ponto/rionorte/backend/marks.php?key=$userId&month=$monthYear&day=$day", [
    'form_params' => [
      'marks' => _json_encode($serializedMarksForOldPonto)
    ]
  ]);
} catch (RequestException $e) {
  error('Error while sending backup to old system: ' . $e->getMessage());
}




try {
  $request = $guzzle->get('https://script.google.com/macros/s/AKfycbz6cw9jXEtwZlp8FOU6eMTBpd5uw_z6TEh8P-3xBQGqa26-jYs/exec', [
    'query' => [
      'obra' => $userId,
      'data' => _json_encode([$date => POST])
    ]
  ]);
} catch (RequestException $e) {
  error('Error while sending backup to old system GOOGLE SPREEDSHEET: ' . $e->getMessage());
}
