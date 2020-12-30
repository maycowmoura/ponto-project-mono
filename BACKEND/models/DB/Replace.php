<?php

require_once __DIR__ . '/../../vendor/autoload.php';

use Opis\Database\Connection;
use Opis\Database\SQL\InsertStatement;


class Replace {
  protected $sql;
  
  function __construct(Connection $connection){
    $this->connection = $connection;
  }

  public function replace(array $values){
    $insert = (new InsertStatement)->insert($values);
    $this->sql = $insert->getSQLStatement();
    return $this;
  }

  public function into(string $table){
    $compiler = $this->connection->getCompiler();

    $this->sql->addTables([$table]);
    $insertQuery = $compiler->insert($this->sql);

    $replaceQuery = str_replace('INSERT INTO', 'REPLACE INTO', $insertQuery);
    $replaceParams = $compiler->getParams();
    return $this->connection->query($replaceQuery, $replaceParams);
  }
}
