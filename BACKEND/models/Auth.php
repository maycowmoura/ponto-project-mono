<?php

require_once __DIR__ . '/SQL.php';
require_once __DIR__ . '/../vendor/autoload.php';

use \Firebase\JWT\JWT;

class Auth {
  public $client;
  public $tokenExpiration;
  private $jwtKey;

  public $user;
  public $userId;
  public $isAdmin;
  public $userName;
  private $accessiblePlaces;
  private $accessibleEmployers;
  private $sql;


  function __construct(){
    $this->jwtKey = 'nT6(uV0:yC4(fH6"iF5>$oD1:cY0@aJ5';


    $headers = apache_request_headers();
    $authorization = $headers['Authorization'] ?? null;
    if(empty($authorization)) die('{"error": "Header de autenticação não encontrado."}');
    $token = preg_replace('/^bearer /i', '', $authorization);

    try{
      $data = JWT::decode($token, $this->jwtKey, ['HS256']);

      $this->client = $data->client;
      $this->userId = $data->user;
      $this->tokenExpiration = $data->exp;

    } catch(Exception $e){
      if($e->getMessage() == 'Expired token'){
        die('{"error": "Chave de acesso expirada."}');
      }
      die('{"error": "Chave de acesso inválida."}');
    }

    $this->sql = new SQL();
    $this->sql->execute(
     "SELECT * 
      FROM `$this->client-users` 
      WHERE id = '$this->userId'"
    );

    $user = $this->sql->getResultArray();

    if(count($user) < 1) die('{"error": "Usuário não localizado."}');

    $user = $user[0];
    $this->user = $user;
    $this->userId = $user['id'];
    $this->userName = $user['name'];
    $this->isAdmin = $user['user_type'] == 'admin';
    $this->isMarker = $user['user_type'] == 'marker';
  }



  public function createToken($payload){
    if(!isset($payload['client']) || !isset($payload['exp'])){
      throw new Exception("A payload deve conter um timestamp de expiração e o nome do cliente");
    }

    return JWT::encode($payload, $this->jwtKey);
  }


  public function mustBeAdmin(){
    if(!$this->isAdmin){
      die('{"error": "Acesso negado. Você precisa ser administrador para executar esta ação."}');
    }
  }


  public function mustBeMarker(){
    if(!$this->isMarker && !$this->isAdmin){
      die('{"error": "Acesso negado. Você precisa ser marcador ou administrador para executar esta ação."}');
    }
  }



  public function getAccessiblePlaces(): array {
    if ($this->accessiblePlaces) {
      return $this->accessiblePlaces;
    }

    $this->sql->execute(
     "SELECT place_id
      FROM `$this->client-users-access` 
      WHERE user_id = '$this->userId'"
    );

    $places = $this->sql->getResultArray();

    if(count($places) < 1) die('{"error": "O usuário não possui acesso a nenhum local de trabalho."}');

    $result = array_map(fn($place) => $place['place_id'], $places);
    $this->accessiblePlaces = $result;
    return $result;
  }


  public function getAccessibleEmployers(): array {
    if($this->accessibleEmployers){
      return $this->accessibleEmployers;
    }

    $this->getAccessiblePlaces();
    $places = implode(',', $this->accessiblePlaces);

    $this->sql->execute(
     "SELECT id
      FROM `$this->client-employers`
      WHERE place IN ($places)"
    );

    $employers = (array) $this->sql->getResultArray();

    if (count($employers) < 1) {
      die('{"error": "Não existem funcionários nos locais de trabalho que você tem acesso."}');
    }

    $result = array_map(fn($employer) => $employer['id'], $employers);
    $this->accessibleEmployers = $result;
    return $result;
  }
}