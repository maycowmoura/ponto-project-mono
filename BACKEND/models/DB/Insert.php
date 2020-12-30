<?php

require_once __DIR__ . '/../../vendor/autoload.php';

use Opis\Database\SQL\Insert as OriginalInsert;
use Opis\Database\SQL\InsertStatement;


class Insert extends OriginalInsert {
  protected $duplicateKey;


  public function into(string $table) {
    return $this->duplicateKey
      ? $this->intoForDuplicateKey($table)
      : parent::into($table);
  }


  public function onDuplicateKeyUpdate(array $values) {
    $compiler = $this->connection->getCompiler();

    $updateSQL = (new InsertStatement)->getSQLStatement();
    $updateSQL->addUpdateColumns($values);
    $updateSQL->addTables(['']);

    $updateQuery = $compiler->update($updateSQL);
    $updateQuery = str_replace('UPDATE `` SET', ' ON DUPLICATE KEY UPDATE', $updateQuery);

    $this->duplicateKey = new stdClass;
    $this->duplicateKey->query = $updateQuery;
    $this->duplicateKey->params = $compiler->getParams();

    return $this;
  }


  protected function intoForDuplicateKey(string $table) {
    $compiler = $this->connection->getCompiler();
    $this->sql->addTables([$table]);

    $insertQuery = $compiler->insert($this->sql);
    $insertParams = $compiler->getParams();

    $query = $insertQuery . $this->duplicateKey->query;

    $params = [...$insertParams, ...$this->duplicateKey->params];
    return $this->connection->query($query, $params);
  }
}
