const { it } = require('@jest/globals');
const api = require('./utils/api');

/**
 * 
 * CREATES THE FIRST PLACE
 * 
 */
it('should reset the database import the sql file', async () => {
  const result = await api.get('/__test__/config-db/reset-db.php');
  expect(result.data).toEqual({ ok: true })
});
