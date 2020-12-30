<?php

require_once __DIR__ . '/global.php';
require_once __DIR__ . '/DB/DB.php';

class Users {
  public $client;
  private $creatorUserId;
  private $newUserId;
  private $time;

  function __construct($authObject = null) {
    $this->client = $authObject->client ?? null;
    $this->creatorUserId = $authObject->userId ?? null;
    $this->time = time();
  }

  public function create(string $name, string $type, array $places): string {
    $this->newUserId = (new DB())
      ->transaction(function ($db) use ($name, $type, $places) {
        $db->insert([
          'name' => $name,
          'user_type' => $type,
          'created_by' => $this->creatorUserId,
          'created_at' => $this->time,
          'refresh_token' => randomString(10)
        ])->into("{$this->client}_users");

        $newUserId = $db->getConnection()->getPDO()->lastInsertId();

        foreach ($places as $place) {
          $db->insert([
            'user_id' => $newUserId,
            'place_id' => $place
          ])->into("{$this->client}_users_accesses");
        }


        return $newUserId;
      });

    return $this->generateHash($this->newUserId);
  }


  public function getAllExceptMyself($selfId): array {
    return (new DB)
      ->from("{$this->client}_users")
      ->where('id')->isNot($selfId)
      ->andWhere('disabled_at')->isNull()
      ->select(['id', 'name'])
      ->all();
  }


  public function getSingleUser($id): object {
    $user = (new DB)
      ->from("{$this->client}_users")
      ->where('id')->is($id)
      ->andWhere('disabled_at')->isNull()
      ->select()
      ->first();


    $user || error("Seu usuário não foi localizado. Solicite a um admin para verificar.");

    return $user;
  }


  public function generateHash($userId): string {
    $db = new DB();

    $userFound = $db->from("{$this->client}_users")
      ->where('id')->is($userId)
      ->andWhere('disabled_at')->isNull()
      ->select(['id'])
      ->first();

    $userFound || error("Seu usuário não foi localizado. Solicite a um admin para verificar.");

    $hash = randomString(15); // se for alterar o tamanho, altere a validação no arquivo 'get-token-from-hash.php'

    $done = $db->replace([
      'hash' => $hash,
      'client' => $this->client,
      'user_id' => $userId,
      'expires' => $this->time + (24 * 60 * 60) // one day ahead
    ])
    ->into('temp_hashes');

    $done || error('Erro inesperado ao criar seu código de acesso.');
    
    return $hash;
  }
}
