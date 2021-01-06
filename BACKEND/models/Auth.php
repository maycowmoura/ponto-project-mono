<?php

require_once __DIR__ . '/DB/DB.php';
require_once __DIR__ . '/../vendor/autoload.php';

use \Firebase\JWT\JWT;

class Auth {
  public $client;
  public $tokenExpiration;
  private $jwtKey;
  private $token;
  private $payload;
  private $db;

  public $user;
  public $userId;
  public $isAdmin;
  public $userName;
  private $refreshToken;
  private $accessiblePlaces;
  private $accessibleEmployers;


  function __construct($checkToken = true) {
    $this->jwtKey = CONFIG['token-key'];

    if (!$checkToken) return;

    $this->db = new DB;
    $this->decodeToken();
    $this->validateToken();
  }


  private function decodeToken() {
    $headers = apache_request_headers();
    $authorization = $headers['Authorization'] ?? null;

    if (empty($authorization))
      error("Header de autenticação não encontrado.");

    $this->token = preg_replace('/^bearer /i', '', $authorization);

    [, $payload] = explode('.', $this->token);
    $this->payload = json_decode(base64_decode($payload), true);

    $this->refreshToken = $this->payload['refresh'] ?? null;
    $this->client = $this->payload['client'] ?? null;
    $this->userId = $this->payload['user'] ?? null;
    $this->userType = $this->payload['typ'] ?? null;
  }




  private function validateToken() {
    try {
      JWT::decode($this->token, $this->jwtKey, ['HS256']);
      //
    } catch (Exception $e) {
      if ($e->getMessage() == 'Expired token') {

        $isUserActive = $this->db
          ->from("{$this->client}_users")
          ->where('id')->is($this->userId)
          ->andWhere('refresh_token')->is($this->refreshToken)
          ->andWhere('disabled_at')->isNull()
          ->select('id')
          ->first();

        if ($isUserActive) {
          $this->payload['exp'] = time() + (60 * 60); // adds 1hr
          $newToken = $this->createToken($this->payload);

          header("Access-Control-Expose-Headers: Refresh-Token");
          header("refresh-token: $newToken");
          return;
          //
        } else {
          $this->isUserDisabled();
        }
        error('Chave de acesso expirada.\nSolicite um novo acesso ao administrador.');
      }
      error("Chave de acesso inválida. Solicite um novo acesso a um administrador.");
    }
  }



  public function createToken($payload) {
    if (!isset($payload['client']) || !isset($payload['user']) || !isset($payload['exp']) || !isset($payload['refresh']) || !isset($payload['typ'])) {
      throw new Exception("A payload deve conter um timestamp de expiração, id do usuário, tipo de usuário, refresh token e o nome do cliente");
    }

    return JWT::encode($payload, $this->jwtKey);
  }



  public function mustBeAdmin() {
    if ($this->userType != 'admin') {
      error("Acesso negado. Você precisa ser administrador para executar esta ação.");
    }
  }



  public function mustBeMarker() {
    if (!$this->userType == 'admin' && !$this->userType == 'marker') {
      error("Acesso negado. Você precisa ser marcador ou administrador para executar esta ação.");
    }
  }



  public function isUserDisabled() {
    $isUserDisabled = !!$this->db
      ->from("{$this->client}_users")
      ->where('id')->is($this->userId)
      ->andWhere(fn ($group) => ( //
        $group->where('refresh_token')->isNot($this->refreshToken)
        ->orWhere('disabled_at')->notNull()))
      ->select()
      ->first();

    if ($isUserDisabled)
      error('Seu usuário foi desabilitado. Contate um administrador.');
  }



  public function getAccessiblePlaces(): array {
    if ($this->accessiblePlaces) {
      return $this->accessiblePlaces;
    }

    $result = $this->db
      ->from(["{$this->client}_users_accesses" => 'a'])
      ->join(["{$this->client}_users" => 'u'], fn ($join) => ( //
        $join->on('u.id', 'a.user_id') //
      ))
      ->where('a.user_id')->is($this->userId)
      ->where('u.disabled_at')->isNull()
      ->select('place_id')
      ->all();

    if (count($result) < 1) {
      $this->isUserDisabled();
      error("Você não possui acesso a nenhum local de trabalho. Contate um administrador.");
    }

    $places = array_map(fn ($place) => $place->place_id, $result);
    $this->accessiblePlaces = $places;
    return $places;
  }


  public function getAccessibleEmployers(): array {
    if ($this->accessibleEmployers) {
      return $this->accessibleEmployers;
    };


    $result = $this->db
      ->from("{$this->client}_employers")
      ->where('place')->in($this->getAccessiblePlaces())
      ->andWhere('disabled_at')->isNull()
      ->select('id')
      ->all();

    if (count($result) < 1) {
      error("Não existem funcionários nos locais de trabalho que você tem acesso.");
    }

    $employers = array_map(fn ($employer) => $employer->id, $result);
    $this->accessibleEmployers = $employers;
    return $employers;
  }
}
