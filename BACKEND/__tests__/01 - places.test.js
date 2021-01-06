const { it } = require('@jest/globals');
const api = require('./utils/api');
const faker = require('faker');
const { invalidToken, mustBeAdmin } = require('./utils/token-tests');
const placesData = [];
const places = [];

/**
 * 
 * CREATES THE PLACES DATA
 * 
 */
const length = faker.random.number({ min: 5, max: 10 });
for (let i = 0; i < length; i++) {
  placesData.push({
    name: faker.address.city(),
    'users-accesses': faker.random.number(10) <= 6 ? [1002] : []
  })
}

/**
 * 
 * CREATES THE FIRST PLACE
 * 
 */
it('should create the first place', async () => {
  const result = await api.post('/places', placesData[0]);
  places.push(result.data);

  expect(result.data).toEqual({
    id: expect.any(Number),
    name: expect.any(String)
  })

  invalidToken('/places', 'post', placesData[0]);
  mustBeAdmin('/places', 'post', placesData[0]);
});



/**
 * 
 * CREATE OTHER PLACES
 * 
 */
it('should create other places', async () => {
  const result = []

  for (let i = 1; i < placesData.length; i++) {
    const response = await api.post('/places', placesData[i]);
    result.push(response.data)
    places.push(response.data);
  }

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String)
      })
    ])
  )
})



/**
 * 
 * GETING PLACES LIST
 * 
 */
it('should get places list', async () => {
  const result = await api.get('/places');
  const resultNames = result.data.map(place => place.name);
  const names = placesData.map(place => place.name.toUpperCase());

  expect(result.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String)
      })
    ])
  )

  expect(resultNames).toEqual(expect.arrayContaining(names));

  invalidToken('/places');
});

it.todo('colocar filtros no get')



/**
 * 
 *  RENAMING A PLACE
 * 
 */
it('should rename a place', async () => {
  const newName = faker.address.city();
  const placeToRename = faker.random.arrayElement(places);
  const result = await api.put(`/places/${placeToRename.id}`, { name: newName });

  expect(result.data).toEqual({
    id: placeToRename.id,
    name: newName.toUpperCase()
  })

  invalidToken(`/places/${placeToRename.id}`, 'put', { name: newName });
  mustBeAdmin(`/places/${placeToRename.id}`, 'put', { name: newName });
});


/**
 * 
 *  DELETING A PLACE
 * 
 */

it('should delete a place', async () => {
  const placeToDelete = faker.random.arrayElement(places);
  const deleted = await api.delete(`/places/${placeToDelete.id}`);
  const result = await api.get('/places');

  expect(deleted.data).toEqual({ ok: true });
  expect(result.data).toEqual(
    expect.not.arrayContaining([placeToDelete.id])
  );

  invalidToken(`/places/${placeToDelete.id}`, 'delete');
  mustBeAdmin(`/places/${placeToDelete.id}`, 'delete');
});


