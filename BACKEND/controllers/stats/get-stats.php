<?php

/**
 * RECEIVES
 *
 * $_GET['type'] = 'type1, type2, ...' // one of the $possibleTypes of stats
 * $_GET['periodFrom'] = '2020-10-20'
 * $_GET['periodTo'] = '2020-12-30'
 *
 *
 * RETURNS
 *
 * a object of filters with this value and prev value
 * {
 *   "filter1": {
 *      "thisData": 145,
 *      "prevData": 127
 *    }
 * }
 *
 */


require_once __DIR__ . '/../../models/global.php';
require_once __DIR__ . '/../../models/Auth.php';
require_once __DIR__ . '/../../models/DB/DB.php';
require_once __DIR__ . '/../../vendor/autoload.php';

use Respect\Validation\Validator as v;

/**
 * Prepare input data for validation
 *
 */
$from = $_GET['from'] ?? null;
$to = $_GET['to'] ?? null;
$statType = !empty($_GET['type']) ? explode(',', $_GET['type']) : null;
$placeFilters = !empty($_GET['place-filters']) ? explode(',', $_GET['place-filters']) : null;

$possibleTypes = [
  'worked-days',
  'misses',
  'breakfasts',
  'lunches',
  'saturdays-worked',
  'saturdays-total',
  'sundays-worked',
  'sundays-total',
  'extras-worked',
  'extras-total'
];


/**
 * RETURN ALL IN DEV_MODE
 * caso esteja no modo desenvolvedor, ele retorna todos os tipos possiveis
 * pra não precisar ficar passando os filtros na url
 */
if (getenv('DEV_MODE') && !$statType) {
  $statType = $possibleTypes;
}




/**
 * Validate input data
 *
 */

try {
  v::stringType()->date()->lessThan($to)->lessThan('now')->setName('From')->check($from);
  v::stringType()->date()->greaterThan($from)->setName('`To`')->check($to);
  v::optional(v::each(v::intVal()))->setName('Place-filters')->check($placeFilters);
  v::each(v::stringType()->in($possibleTypes))->setName('Type')->check($statType);

  if ((strtotime($to) - strtotime($from)) > (31 * 24 * 60 * 60)) {
    error('Ops... Escolha um período de até 31 dias.');
  }
} catch (Exception $e) {
  error($e->getMessage());
}

/**
 * Checks authentication
 *
 */
$auth = new Auth();
$auth->mustBeAdmin();
$userId = $auth->userId;
$client = $auth->client;
$accessiblePlaces = $auth->getAccessiblePlaces();


/**
 * Creates the dates for previous period
 * based on the difference os days of this period
 */
$diff = (new DateTime($from))->diff(new DateTime($to))->format('%a') + 1;
$diff = DateInterval::createFromDateString("$diff days");
$oneDay = DateInterval::createFromDateString('1 days');
$prevPeriodFrom = (new DateTime($from))->sub($diff)->format('Y-m-d');
$prevPeriodTo = (new DateTime($from))->sub($oneDay)->format('Y-m-d');



/**
 * Se o $to é maior que hoje, ou seja, uma data no futuro, então limita a hoje.
 * Isso deve ser feito após o calculo das $diffs (acima) para não atrapalhar o calculo das datas
 */
$today = date('Y-m-d');
if ($to > $today) {
  $to = $today;
}



$db = new DB();

/**
 * Get the employers IDs to filter the selects soon
 *
 */
$filtredEmployers = $db
  ->from("{$client}_employers")
  ->where(function ($group) use ($accessiblePlaces, $placeFilters) {
    $group->where('place')->in($accessiblePlaces);
    $placeFilters && $group->andWhere('place')->in($placeFilters);
  })
  ->select('id')
  ->all();

$filtredEmployers = array_map(fn ($employer) => $employer->id, $filtredEmployers);

if (count($filtredEmployers) < 1) {
  error('Não há nenhum funcionário nos locais filtrados.');
}



// will receive the result data
$result = [];



/**
 *  WORKED DAYS
 *
 */
if (in_array('worked-days', $statType)) {
  $getData = fn ($dateFrom, $dateTo) => ( //
    $db->from("{$client}_marks")
    ->where('date')->between($dateFrom, $dateTo)
    ->andWhere('employer_id')->in($filtredEmployers)
    ->count('id'));

  $result['worked-days'] = [
    'thisData' => $getData($from, $to) ?? 0,
    'prevData' => $getData($prevPeriodFrom, $from) ?? 0
  ];
}

/**
 *  MISSES
 *
 */
if (in_array('misses', $statType)) {
  $getData = fn ($dateFrom, $dateTo) => ( //
    $db->from("{$client}_marks")
    ->where('date')->between($dateFrom, $dateTo)
    ->andWhere('employer_id')->in($filtredEmployers)
    ->andWhere(function ($group) {
      $group->where('time_in')->is(-1)
        ->andWhere('time_out')->is(-1)
        ->andWhere('holiday')->isNull();
    })
    ->count('id'));

  $result['misses'] = [
    'thisData' => $getData($from, $to) ?? 0,
    'prevData' => $getData($prevPeriodFrom, $from) ?? 0
  ];
}


/**
 *  BREAKFASTS
 *
 */
if (in_array('breakfasts', $statType)) {
  $getData = fn ($dateFrom, $dateTo) => ( //
    $db->from("{$client}_marks")
    ->where('date')->between($dateFrom, $dateTo)
    ->andWhere('employer_id')->in($filtredEmployers)
    ->sum(fn ($sum) => $sum->{'IF(time_before IS NULL OR time_before > -40, 1, 0)'}) // se chegou até 7:40h
  );

  $result['breakfasts'] = [
    'thisData' => $getData($from, $to) ?? 0,
    'prevData' => $getData($prevPeriodFrom, $from) ?? 0
  ];
}


/**
 *  LUNCHES
 *
 */
if (in_array('lunches', $statType)) {
  $getData = fn ($dateFrom, $dateTo) => ( //
    $db->from("{$client}_marks")
    ->where('date')->between($dateFrom, $dateTo)
    ->andWhere('employer_id')->in($filtredEmployers)
    ->sum(fn ($sum) => $sum->{'IF(time_in <= 690 AND time_out >= 720, 1, 0)'}) // chegou 11:30h ou antes, e saiu 12h ou dps
  );

  $result['lunches'] = [
    'thisData' => $getData($from, $to) ?? 0,
    'prevData' => $getData($prevPeriodFrom, $from) ?? 0
  ];
}


/**
 *  GET DATA FOR SUNDAYS E SATURDAYS
 *  como sundays/satudays worked/total são a mesma query só mudando o weekday
 *  essa função será usada pra ambos 
 */

$getDataForSundaysAndSaturdays = fn ($dateFrom, $dateTo, $weekday, $columnToCount) => ( //
  $db->from("{$client}_marks")
  ->where('date')->between($dateFrom, $dateTo)
  ->andWhere('employer_id')->in($filtredEmployers)
  ->andWhere('time_in')->atLeast(0)
  ->andWhere('weekday')->is($weekday)
  ->count($columnToCount, true) // true é para adicionar um distinct
);


/**
 *  SATURDAYS WORKED
 *  soma em quantos sábados ao menos 1 funcionário trabalhou no periodo
 *  ou seja, em quantos sábados ouve expediente
 *  usa o 'date' como coluna pra fazer o distinct do select e cada data somar só +1
 */
if (in_array('saturdays-worked', $statType)) {
  $result['saturdays-worked'] = [
    'thisData' => $getDataForSundaysAndSaturdays($from, $to, 6, 'date') ?? 0,
    'prevData' => $getDataForSundaysAndSaturdays($prevPeriodFrom, $from, 6, 'date') ?? 0
  ];
}

/**
 *  SATURDAYS TOTAL
 *  soma todos os sábados trabalhados de todos os funcionários
 *  usa o 'id' como coluna pra somar todas as marcações de todos os funcionários
 */
if (in_array('saturdays-total', $statType)) {
  $result['saturdays-total'] = [
    'thisData' => $getDataForSundaysAndSaturdays($from, $to, 6, 'id') ?? 0,
    'prevData' => $getDataForSundaysAndSaturdays($prevPeriodFrom, $from, 6, 'id') ?? 0
  ];
}

/**
 *  SUNDAYS WORKED
 *  mesma coisa do saturdays-worked, só muda o weekday mesmo
 */
if (in_array('sundays-worked', $statType)) {
  $result['sundays-worked'] = [
    'thisData' => $getDataForSundaysAndSaturdays($from, $to, 0, 'date') ?? 0,
    'prevData' => $getDataForSundaysAndSaturdays($prevPeriodFrom, $from, 0, 'date') ?? 0
  ];
}

/**
 *  SUNDAYS TOTAL
 *  mesma coisa do saturdays-total, só muda o weekday mesmo
 */
if (in_array('sundays-total', $statType)) {
  $result['sundays-total'] = [
    'thisData' => $getDataForSundaysAndSaturdays($from, $to, 0, 'id') ?? 0,
    'prevData' => $getDataForSundaysAndSaturdays($prevPeriodFrom, $from, 0, 'id') ?? 0
  ];
}


/**
 *  EXTRAS WORKED
 *  Soma todos os DIAS que tiveram hora extra de ao menos 1 funcionário
 *  A conta é apenas quantos DIAS houveram, não o total
 */
if (in_array('extras-worked', $statType)) {
  $getData = fn ($dateFrom, $dateTo) => ( //
    $db->from("{$client}_marks")
    ->where('date')->between($dateFrom, $dateTo)
    ->andWhere('employer_id')->in($filtredEmployers)
    ->where(function ($group) {
      $group->andWhere('time_before')->greaterThan(0)
        ->orWhere('time_after')->greaterThan(0);
    })
    ->count('date', true) // true é para adicionar um distinct
  );

  $result['extras-worked'] = [
    'thisData' => $getData($from, $to) ?? 0,
    'prevData' => $getData($prevPeriodFrom, $from) ?? 0
  ];
}

/**
 *  EXTRAS TOTAL
 *  Retorna o total de MINUTOS de horas extras, somando TODOS os funcionários
 */
if (in_array('extras-total', $statType)) {
  $getData = fn ($dateFrom, $dateTo) => ( //
    $db->from("{$client}_marks")
    ->where('date')->between($dateFrom, $dateTo)
    ->andWhere('employer_id')->in($filtredEmployers)
    ->where(function ($group) {
      $group->andWhere('time_before')->greaterThan(0)
        ->orWhere('time_after')->greaterThan(0);
    })
    ->sum(fn ($sum) => $sum->{ //
      '(IF(time_before IS NULL, 0, time_before) + IF(time_after IS NULL, 0, time_after))' // se tem hora extra antes ou depois do expediente, soma
    }));

  $result['extras-total'] = [
    'thisData' => $getData($from, $to) ?? 0,
    'prevData' => $getData($prevPeriodFrom, $from) ?? 0
  ];
}

// foreach ($db->getLog() as $log) {
//   echo $log['query'] . '<br><br>';
// }

$json = _json_encode($result);
die($json);
