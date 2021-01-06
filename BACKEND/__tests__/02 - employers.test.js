const { it } = require('@jest/globals');
const api = require('./utils/api');
const faker = require('faker-br');
const { invalidToken, mustBeAdmin } = require('./utils/token-tests');
const data = [];
const employers = [];
let places = [];

/**
 * 
 * CREATES THE DATA
 * 
 */
it('should create the fake data', async () => {
  const placesResult = await api.get('/places');
  places = placesResult.data;

  const length = faker.random.number({ min: 12, max: 20 });
  for (let i = 0; i < length; i++) {
    data.push({
      name: faker.name.findName().replace('.', ''),
      job: faker.name.jobTitle(),
      place: faker.random.arrayElement(places).id
    })
  }

  expect(data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: expect.any(String),
        job: expect.any(String),
        place: expect.any(Number),
      })
    ])
  )
})

/**
 * 
 * CREATES THE FIRST EMPLOYER
 * 
 */
it('should create the first employer', async () => {
  const result = await api.post('/employers', data[0]);
  const place = places.filter(place => place.id == data[0].place);
  employers.push(result.data);


  expect(result.data).toEqual({
    id: expect.any(Number),
    name: data[0].name.toUpperCase(),
    job: data[0].job.toUpperCase(),
    place: place[0].name
  })

  invalidToken('/employers', 'post', data[0]);
  mustBeAdmin('/employers', 'post', data[0]);
});



/**
 * 
 * CREATE OTHER EMPLOYERS
 * 
 */
it('should create other employers', async () => {
  const result = []

  for (let i = 1; i < data.length; i++) {
    const response = await api.post('/employers', data[i]);
    result.push(response.data)
    employers.push(response.data);
  }

  expect(result).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        job: expect.any(String),
        place: expect.any(String)
      })
    ])
  )
})



/**
 * 
 * GETING EMPLOYERS LIST
 * 
 */
it('should get employers list', async () => {
  const result = await api.get('/employers');

  expect(result.data).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        job: expect.any(String),
        place_id: expect.any(Number),
        place: expect.any(String)
      })
    ])
  )

  invalidToken('/employers');
  // mustBeAdmin('/employers');
});

it.todo('colocar filtros no get')


/**
 * 
 *  TRANSFER EMPLOYER
 * 
 */
it('should transfer the employer', async () => {
  const employer = faker.random.arrayElement(employers);
  const place = faker.random.arrayElement(places).id;
  const result = await api.put(`/employers/transfer/${employer.id}`, { place });
  expect(result.data).toEqual({ ok: true })

  const getEmployers = await api.get('/employers');
  const thisEmployer = getEmployers.data.filter(item => item.id == employer.id);
  expect(thisEmployer[0].place_id).toBe(place);

  invalidToken(`/employers/transfer/${employer.id}`, 'put', { place });
  mustBeAdmin(`/employers/transfer/${employer.id}`, 'put', { place });
});


/**
 * 
 *  ARCHIVING AN EMPLOYER
 * 
 */

it('should archive a employer', async () => {
  const employer = faker.random.arrayElement(employers);
  const archived = await api.delete(`/employers/${employer.id}`);
  const result = await api.get('/employers');

  expect(archived.data).toEqual({ ok: true });
  expect(result.data).toEqual(
    expect.not.arrayContaining([employer.id])
  );

  invalidToken(`/places/${employer.id}`, 'delete');
  mustBeAdmin(`/places/${employer.id}`, 'delete');
});


