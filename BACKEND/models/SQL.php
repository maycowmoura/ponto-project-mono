<?php

// USAGE

// $sql = new SQL();
// $sql->execute("SELECT * FROM my_table");
// $result = $sql->getResultArray();

// var_dump($result);


class SQL
{
  private $sql;
  public $result;

  function __construct($banco = 'ponto'){
    $this->sql = new PDO("mysql:host=localhost;charset=utf8;dbname=$banco", 'root', '');
    $this->sql->errorCode() == 0 || $this->error(
      'SQL Connection | ' . $this->sql->errorCode() . ' - ' . $this->sql->errorInfo()[2]
    );
  }

  private function error($message){
    throw new Exception($message);
  }

  function beginTransaction(){
    $this->sql->beginTransaction();
  }

  function execute($query){
    $this->result = $this->sql->query($query);
    $this->sql->errorCode() == 0 || $this->error(
      'SQL Execution | ' . $this->sql->errorCode() . ' - ' . $this->sql->errorInfo()[2]
    );
  }

  function commit()
  {
    $this->sql->commit();
  }

  function close()
  {
    $this->sql->close();
  }

  function getResultArray()
  {
    return $this->result->fetchAll(PDO::FETCH_ASSOC);
  }

  function getTotalAffected(){
    return $this->result->rowCount() ?? 0;
  }

  function getError()
  {
    $number = $this->sql->errorCode();
    $message = $this->sql->errorInfo()[2];
    return "$number - $message";
  }
}
