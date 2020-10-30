<?php

// USAGE

// $sql = new SQL();
// $sql->execute("SELECT * FROM my_table");
// $result = $sql->getResultArray();

// var_dump($result);


class SQL {
  private $sql;
  public $result;

  function __construct($banco = 'ponto'){
    $this->sql = new mysqli(
      'localhost',
      'root', 
      '', 
      $banco
    );
    $this->sql->set_charset("utf8");
    $this->sql->connect_errno && $this->error('SQL->connect() | '.$this->sql->connect_error);
  }

  private function error($message){
    die("{\"error\": \"$message\"");
  }

  function execute($query){
    $this->result = $this->sql->query($query);
    $this->sql->errno && $this->error('SQL->execute() | '.$this->sql->error);
  }

  function close(){
    $this->sql->close();
  }

  function getResultArray(){
    return $this->result->fetch_all(SQLI_ASSOC);
  }

  function getTotal(){
    return $this->result->num_rows ?? 0;
  }

  function getTotalAffected(){
    return $this->result->affected_rows ?? 0;
  }

  function getLastInsertId(){
    return $this->insert_id;
  }

  function getError(){
    $number = $this->errno;
    $message = $this->error;
    return "$number - $message";
  }
}
