const { it } = require('@jest/globals');
const api = require('./utils/api');
const faker = require('faker');
const { format, addDays } = require('date-fns');
const { invalidToken, mustBeAdmin } = require('./utils/token-tests');


/**
 * 
 * GETING STATS
 * 
 */

async function getStats(from, to, expectHandler) {
  const possibleKeys = [
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
  ]

  const result = await api.get('/stats', { params: { from, to } });

  if (expectHandler) {
    expectHandler(result.data);
    return;
  }

  const keys = Object.keys(result.data);
  const values = Object.values(result.data);
  expect(keys).toEqual(expect.arrayContaining(possibleKeys));
  expect(values).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        thisData: expect.any(Number),
        prevData: expect.any(Number)
      })
    ])
  );
}





it('should get stats with Dynamic dates', async () => {
  let from, to;
  for (let i = 0; i < 5; i++) {
    const date = faker.date.past();
    const days = faker.random.number({ min: 10, max: 31 });
    from = format(date, 'yyyy-MM-dd');
    to = format(addDays(date, days), 'yyyy-MM-dd');

    await getStats(from, to)
  }

  invalidToken('/stats', 'get', null, { from, to });
  mustBeAdmin('/stats', 'get', null, { from, to });
});



it('should NOT get stats for more than 31 days period', async () => {
  const date = faker.date.past();
  const days = faker.random.number({ min: 32, max: 60 });
  const from = format(date, 'yyyy-MM-dd');
  const to = format(addDays(date, days), 'yyyy-MM-dd');

  await getStats(from, to, function (result) {
    expect(result?.error).toBe('Ops... Escolha um período de até 31 dias.');
  })
});




it('should NOT get stats when TO is earlier then FROM', async () => {
  await getStats('2020-10-31', '2020-10-20', function (result) {
    expect(result?.error).toMatch('From must be less than');
  })
});
