const { it } = require('@jest/globals');
const api = require('./utils/api');
const { invalidToken, mustBeAdmin } = require('./utils/token-tests');


/**
 * 
 * GETING SASHBOARD
 * 
 */
it('should get stats', async () => {
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

  const result = await api.get('/stats', {
    params: { from: '2020-11-01', to: '2020-11-30' }
  });
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



  invalidToken('/dashboard');
  mustBeAdmin('/dashboard');
});


it.todo('colocar a data dinamica')
it.todo('colocar datas de periodos invalidos (grandes demais)')