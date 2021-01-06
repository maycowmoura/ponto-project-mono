const { it } = require('@jest/globals');
const api = require('./utils/api');
const { invalidToken, mustBeAdmin } = require('./utils/token-tests');


/**
 * 
 * GETING DASHBOARD
 * 
 */
it('should get the initial dashboard', async () => {
  const result = await api.get('/dashboard');

  expect(result.data).toEqual({
    employers: expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        job: expect.any(String),
        place_id: expect.any(Number),
        place: expect.any(String)
      })
    ]),
    places: expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String)
      })
    ])
  })

  invalidToken('/dashboard');
  mustBeAdmin('/dashboard');
});


it.todo('incluir teste para ver se vem algum funcionario ou local arquivado')