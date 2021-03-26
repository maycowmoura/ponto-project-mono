<?php

require_once __DIR__ . '/global.php';
require_once __DIR__ . '/DB/DB.php';

class Marks {
  private string $client;
  private $db;
  private string $date;
  private int $weekday;
  private int $userId;
  private bool $isHoliday;
  private int $employerId;
  private int $time_in;
  private int $time_out;
  private $time_before;
  private $time_after;
  private bool $hasComment;
  private $comment;

  function __construct($client, $date, $userId) {
    $this->client = $client;
    $this->date = $date;
    $this->weekday = date_format(date_create_from_format('Y-m-d', $date), 'w');
    $this->userId = intVal($userId);
    $this->isHoliday = $this->isHoliday();

    $this->db = new DB();
    $this->db->getConnection()->getPDO()->beginTransaction();
  }




  private function isHoliday() {
    $dateWithoutYear = preg_replace('/^\d{4}-/', '', $this->date);

    return !!(new DB())
      ->from("{$this->client}_holidays")
      ->where('date')->is($this->date)
      ->orWhere('date')->is($dateWithoutYear)
      ->select()
      ->first();
  }


  public function setEmployer($id) {
    $this->employerId = $id;
  }


  public function setTimes($time_in, $time_out) {
    $this->time_in = $time_in;
    $this->time_out = $time_out;
  }


  public function setDefaultTimes($default_time_in, $default_time_out) {
    $calc_before = ($default_time_in - $this->time_in);
    $calc_after = ($this->time_out - $default_time_out);

    if ($default_time_in && $this->time_in >= 0) {
      $this->time_before = $calc_before ? $calc_before : null;
      $this->time_after = $calc_after ? $calc_after : null;
      //
    } else {
      $this->time_before = $this->time_after = null;
    }
  }


  public function setComment($comment) {
    $this->comment = !empty(trim($comment)) ? trim($comment) : null;
  }

  /**
   * Deletes a previous mark of this employer on this date
   */
  private function deleteMarkIfExists() {
    $this->db->from("{$this->client}_marks")
      ->where('employer_id')->is($this->employerId)
      ->andWhere('date')->is($this->date)
      ->delete();
  }

  /**
   * Finish the current mark data and prepare queries for it
   * Now you can add another mark
   */
  public function next() {
    //Sendo feriado, time before e after é null
    if ($this->isHoliday) {
      $this->time_before = $this->time_after = null;
    }

    // Cria um IF em SQL para o campo de comentário
    $makeIf = function ($expr, $col, $value) {
      // se o comentário for o mesmo, mantém o valor, se mudou, coloca o novo valor
      // exemplo: IF(`comment` = 'abcde', `comment`, 'abcde')
      return $this->comment
        ? $expr->{'IF(`comment` ='}->value($this->comment)->{','}->column($col)->{','}->value($value)->{')'}
        : $expr->value(null);
    };

    //faz backup da row na tabela marks_history
    $this->db->prepare(
      "INSERT INTO `{$this->client}_marks_history`
      SELECT * FROM `{$this->client}_marks` 
      WHERE `employer_id` = :employer_id
      AND `date` = :date;"
    )->execute([
      'employer_id' => $this->employerId,
      'date' => $this->date
    ]);


    // Organiza os dados e faz a inserção
    $valuesForUpdate = [
      'time_in' => $this->time_in,
      'time_out' => $this->time_out,
      'time_before' => $this->time_before,
      'time_after' => $this->time_after,
      'created_by' => $this->userId,
      'created_at' => time(),
      'commented_at' => fn ($expr) => $makeIf($expr, 'commented_at', time()),
      'commented_by' => fn ($expr) => $makeIf($expr, 'commented_by', $this->userId),
      'comment' => fn ($expr) => $makeIf($expr, 'comment', $this->comment) // o comment deve ser a última a ser alterada, pois ele é usado no if do commented_at e commented_by
    ];

    $valuesForInsert = array_merge($valuesForUpdate, [
      'employer_id' => $this->employerId,
      'date' => $this->date,
      'weekday' => $this->weekday,
      'holiday' => $this->isHoliday ? 1 : null,
    ]);

    $this->db->insert($valuesForInsert)
      ->onDuplicateKeyUpdate($valuesForUpdate)
      ->into("{$this->client}_marks");

    // Sendo falta, sem comentário, no feriado/fim de semana: deleta a marcação
    if ($this->isHoliday || in_array($this->weekday, [0, 6])) {
      $this->db->from("{$this->client}_marks")
        ->where('employer_id')->is($this->employerId)
        ->andWhere('date')->is($this->date)
        ->andWhere('time_in')->is(-1)
        ->andWhere('comment')->isNull()
        ->delete();
    }
  }


  /**
   * Commit all changes
   */
  public function saveAll() {
    $this->db->getConnection()->getPDO()->commit();
  }
}
