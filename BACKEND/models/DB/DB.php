<?php

// USAGE

// Documentation https://opis.io/database/4.x/

// Methods avaliable not in documentation
// $db->query($query, $params) // executes a query
// $db->getPDO() // returns the PDO object
// they're avalibale on connection.php file of the library 
// https://github.com/opis/database/blob/master/src/Connection.php


require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/Replace.php';
require_once __DIR__ . '/Insert.php';

use Opis\Database\Database;
use Opis\Database\ResultSet;
use Opis\Database\Connection;



class DB extends Database {
  public $connection;
  private $prepared;

  function __construct() {
    $this->connection = new Connection(
      'mysql:host=localhost;dbname=' . CONFIG['db-name'] . ';charset=utf8',
      CONFIG['db-user'],
      CONFIG['db-password']
    );

    $this->connection->logQueries();
    return new Database($this->connection);
  }



  public function insert(array $values): Insert {
    return (new Insert($this->connection))->insert($values);
  }


  public function replace(array $values): Replace {
    return (new Replace($this->connection))->replace($values);
  }


  public function prepare($query) {
    $this->prepared = $this->connection->getPDO()->prepare($query);
    return $this;
  }


  public function execute($values) {
    foreach ($values as $key => $value) {
      $this->prepared->bindValue($key, $value);
    }
    $this->prepared->execute();
    return new ResultSet($this->prepared);
  }
}
