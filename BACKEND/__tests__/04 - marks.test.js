const { it, describe } = require('@jest/globals');
const api = require('./utils/api');
const faker = require('faker');
const { format, parse, isWeekend, isFriday, addDays } = require('date-fns');
const { invalidToken } = require('./utils/token-tests');
const marks = { byDay: {}, byPeriod: {}, byDate: {} };
const employers = { list: [], byId: {} };

/**
 * 
 * USEFUL FUNCTIONS
 * 
 */
function generateMarkTimes() {
  const chance1 = faker.random.number(10);
  const chance2 = faker.random.number(10);
  const chance3 = faker.random.number(10);
  const chance4 = faker.random.number(10);
  const variation1 = chance1 <= 6 ? 0 : faker.random.number({ min: -200, max: 200 }) // 60% de chance da variação ser 0
  const variation2 = chance1 <= 6 ? 0 : faker.random.number({ min: -200, max: 200 })
  let time1 = chance2 <= 8 ? (420 + variation1) : faker.random.number(1439); // 80% de chance de usar o horario padrão + variação, e 20% de ser aleatório
  let time2 = chance3 <= 8 ? (1020 + variation2) : faker.random.number(1439);

  // 20% de chance de ser falta
  if (chance4 < 2) {
    time1 = time2 = -1;
  }

  return [
    Math.min(time1, time2),
    Math.max(time1, time2)
  ]
}

function generateComment() {
  const comment = faker.lorem.sentence();
  return comment.length > 200 ? comment.substring(0, 200) : comment;
}

function getDefaultTimes(date) {
  const parsed = parse(date, 'yyyy-MM-dd', new Date);
  let time_in = 420;
  let time_out = 1020;

  if (isFriday(parsed)) {
    time_out = 960;
  } else if (isWeekend(parsed)) {
    time_in = time_out = null;
  }

  return [time_in, time_out];
}

function generateMissOnWeekend(employers) {
  let date = faker.date.past();
  while (!isWeekend(date)) {
    date = faker.date.past();
  }

  const formated = format(date, 'yyyy-MM-dd');

  return {
    date: formated,
    values: [{
      id: faker.random.arrayElement(employers).id,
      time_in: -1,
      time_out: -1,
      comment: generateComment()
    }, {
      id: faker.random.arrayElement(employers).id,
      time_in: -1,
      time_out: -1,
      comment: null
    }]
  }
}

expect.extend({
  toBeNumberOrNull(received) {
    const pass = received === null || Number.isInteger(received);
    return {
      message: () => 'Number or Null',
      pass
    }
  },
  toBeStringOrNull(received) {
    const pass = received === null || (typeof received == 'string' && received.length);
    return {
      message: () => 'Number or Null',
      pass
    }
  }
})


/**
 * 
 * CREATES THE DATA
 * 
 */
it('should generate the fake data', async () => {
  // gera 15 datas no passado com o faker
  const dates = [];
  for (let i = 0; i < 15; i++) {
    dates.push(faker.date.past());
  }

  // pega os employers
  const employersResult = await api.get('/employers');
  employers.list.push(...employersResult.data);
  employers.list.forEach(employer => employers.byId[employer.id] = employer);

  // gera ids onde só haverá UMA marcação para cada employer em cada data
  // ou seja, garante que não vai haver duas marcações para o mesmo empregado no mesmo dia
  const noRepeater = [];
  function generateUniqueDateId() {
    const date = faker.random.arrayElement(dates);
    const id = faker.random.arrayElement(employers.list).id;
    const dateId = date + '_' + id;

    if (noRepeater.includes(dateId)) {
      return generateUniqueDateId();
    } else {
      noRepeater.push(dateId);
      return [date, id];
    }
  }

  const length = faker.random.number({ min: 40, max: 120 }); // vai gerar entre 40 e 120 marcações no total
  for (let i = 0; i < length; i++) {
    const [dateObject, id] = generateUniqueDateId(); // pega a data e id do employer pra gerar a marcação
    const date = format(dateObject, 'yyyy-MM-dd');
    const dateId = date + '_' + id;
    const employer = employers.byId[id];
    const comment = faker.random.number(10) <= 3 ? generateComment() : null // tem 30% de change da marcação ter comentário
    const [time_in, time_out] = generateMarkTimes() // gera as marcações
    const [default_time_in, default_time_out] = getDefaultTimes(date);
    let time_before = default_time_in - time_in;
    let time_after = time_out - default_time_out;
    time_before = default_time_in && time_before && time_in > -1 ? time_before : null;
    time_after = default_time_out && time_after && time_out > -1 ? time_after : null;

    if (!marks.byDate[date]) marks.byDate[date] = [];
    marks.byDate[date].push({ id, time_in, time_out, comment });

    marks.byDay[dateId] = {
      id, default_time_in, default_time_out, time_in, time_out, comment,
      name: employer.name,
      job: employer.job,
      place_id: employer.place_id,
    }

    marks.byPeriod[dateId] = {
      time_in, time_out, comment, time_before, time_after,
      holiday: null,
      weekday: dateObject.getDay(),
      commented_at: expect.toBeNumberOrNull(),
      commented_by: expect.toBeStringOrNull(),
      created_by: expect.any(String)
    }


    // checa se gerou direitinho
    expect(marks.byDay[dateId]).toMatchObject({
      id,
      time_in: expect.any(Number),
      time_out: expect.any(Number),
      default_time_in: expect.toBeNumberOrNull(),
      default_time_out: expect.toBeNumberOrNull(),
      name: employer.name,
      job: employer.job,
      comment: expect.toBeStringOrNull()
    })

    expect(marks.byDay[dateId]).toMatchObject({
      time_in: expect.any(Number),
      time_out: expect.any(Number),
      comment: expect.toBeStringOrNull()
    })
  }
})



/**
 *
 * CREATE MARKS
 * posta as marcações no sistema
 *
 */
it('should create the marks with the generated data', async () => {
  const results = [];

  for (const date in marks.byDate) {
    const response = await api.post(`/marks/${date}`, marks.byDate[date]);
    results.push(response.data)
  }

  expect(results).toEqual(
    expect.arrayContaining([{ ok: true }])
  )

  const [date, values] = Object.entries(marks.byDate)[0];
  invalidToken(`/marks/${date}`, 'post', values);
})




/**
 *
 * CHECKS THE CREATED MARKS BY DAY
 * pega as marcações do sistema
 * e checa se elas batem com os dados gerados aqui no teste
 *
 */
it('should get all marks BY DAY', async () => {
  for (const date in marks.byDate) {
    const response = await api.get(`/marks/${date}`);
    const isWknd = isWeekend(parse(date, 'yyyy-MM-dd', new Date));

    for (const result of response.data) {
      const { id } = result;
      const mark = marks.byDay[date + '_' + id];
      const shouldBeSkipped = isWknd && mark?.time_in == -1 && !mark?.comment;

      if (mark && !shouldBeSkipped) {
        expect(result).toMatchObject(mark)

      } else {
        const employer = employers.byId[id];
        const [default_time_in, default_time_out] = getDefaultTimes(date);

        expect(result).toMatchObject({
          id,
          default_time_in,
          default_time_out,
          name: employer.name,
          place_id: employer.place_id,
          job: employer.job,
          comment: null,
          time_in: null,
          time_out: null
        })
      }
    }
  }

  const date = Object.keys(marks.byDate)[0];
  invalidToken(`/marks/${date}`);
})




/**
 *
 * CHECKS THE CREATED MARKS BY PERIOD
 * pega as marcações do sistema
 * e checa se elas batem com os dados gerados aqui no teste
 *
 */

it('should get all marks BY PERIOD', async () => {
  const datesAscending = Object.keys(marks.byDate).sort((a, b) => new Date(...a.split('-')) - new Date(...b.split('-')));
  const minDate = parse(datesAscending[0], 'yyyy-MM-dd', new Date)
  const maxDate = parse(datesAscending.pop(), 'yyyy-MM-dd', new Date);

  const allDates = [];
  let activeDate = minDate;
  
  while (activeDate <= maxDate) {
    allDates.push({
      object: activeDate,
      formatted: format(activeDate, 'yyyy-MM-dd')
    });
    
    activeDate = addDays(activeDate, 1);
  }
  
  
  for (const { id } of employers.list) {
    let expected = {};
    let startDate = format(minDate, 'yyyy-MM-dd');
    let daysCounter = 1;
    const lastDate = allDates[allDates.length - 1].formatted;

    for (const date of allDates) {
      const mark = marks.byPeriod[date.formatted + '_' + id];
      const isWknd = isWeekend(date.object);
      const shouldBeSkipped = isWknd && mark?.time_in == -1 && !mark?.comment;

      expected[date.formatted] = mark && !shouldBeSkipped
        ? mark
        : { holiday: null, weekday: date.object.getDay() }

      if (daysCounter == 62 || date.formatted == lastDate) {
        const response = await api.get(`/marks/list/${id}?from=${startDate}&to=${date.formatted}`);
        expect(response.data).toMatchObject(expected);

        expected = {};
        startDate = date.formatted;
        daysCounter = 1;

      } else {
        daysCounter++;
      }

    }
  }

  const date = Object.keys(marks.byDate)[0];
  invalidToken(`/marks/${date}`);
})

