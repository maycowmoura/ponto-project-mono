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


  function __construct($checkToken = true){
    $this->jwtKey = CONFIG['token-key'];

    if(!$checkToken){
      return;
    }
    
    $headers = apache_request_headers();
    $authorization = $headers['Authorization'] ?? null;
    if(empty($authorization)) error("Header de autenticação não encontrado.");
    $token = preg_replace('/^bearer /i', '', $authorization);

    [, $payload] = explode('.', $token);
    $payload = json_decode(base64_decode($payload), true);
    $refreshToken = $payload['refresh'];
    $this->client = $payload['client'];
    $this->userId = $payload['user'];
    $this->userType = $payload['typ'];
    $this->sql = new SQL();

    try{
      JWT::decode($token, $this->jwtKey, ['HS256']);
      
    } catch(Exception $e){
      if($e->getMessage() == 'Expired token'){
        $this->sql->execute(
          "SELECT id 
          FROM `$this->client-users` 
          WHERE id = '$this->userId' 
          AND refresh_token = '$refreshToken'
          AND disabled_at IS NULL"
        );

        if(count($this->sql->getResultArray()) > 0){
          $payload['exp'] = time() + (60 * 60); // adds 1hr
          $newToken = $this->createToken($payload);
          header("Access-Control-Expose-Headers: Refresh-Token");
          header("refresh-token: $newToken");
          return;
        }

        error('Chave de acesso expirada.\nSolicite um novo acesso ao administrador.');
      }

      error("Chave de acesso inválida. Solicite um novo acesso a um administrador.");
    }
  }


  public function createToken($payload){
    if(!isset($payload['client']) || !isset($payload['user']) || !isset($payload['exp']) || !isset($payload['refresh']) || !isset($payload['typ'])){
      throw new Exception("A payload deve conter um timestamp de expiração, id do usuário, tipo de usuário, refresh token e o nome do cliente");
    }

    return JWT::encode($payload, $this->jwtKey);
  }


  public function mustBeAdmin(){
    if(!$this->userType == 'admin'){
      error("Acesso negado. Você precisa ser administrador para executar esta ação.");
    }
  }


  public function mustBeMarker(){
    if(!$this->userType == 'admin' && !$this->userType == 'marker'){
      error("Acesso negado. Você precisa ser marcador ou administrador para executar esta ação.");
    }
  }



  public function getAccessiblePlaces(): array {
    if ($this->accessiblePlaces) {
      return $this->accessiblePlaces;
    }

    $this->sql->execute(
     "SELECT place_id
      FROM `$this->client-users-accesses` AS a
      JOIN `$this->client-users` AS u
      ON u.id = '$this->userId' AND u.disabled_at IS NULL
      WHERE a.user_id = '$this->userId'"
    );

    $places = $this->sql->getResultArray();

    if(count($places) < 1) error("Você não possui acesso a nenhum local de trabalho. Contate um administrador.");

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
      WHERE place IN ($places)
      AND disabled_at IS NULL"
    );

    $employers = (array) $this->sql->getResultArray();

    if (count($employers) < 1) {
      error("Não existem funcionários nos locais de trabalho que você tem acesso.");
    }

    $result = array_map(fn($employer) => $employer['id'], $employers);
    $this->accessibleEmployers = $result;
    return $result;
  }
}