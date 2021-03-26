const { it } = require('@jest/globals');
const api = require('./utils/api');

/**
 * 
 * RESETS THE DATABASE
 * 
 */
it('should reset the database import the sql file', async () => {
  const result = await api.get('/__tests__/config-db/reset-db.php');
  expect(result.data).toEqual({ ok: true })
});
