const request = require("supertest");
const { app } = require('./../server');
const { schema } = require('./schema.js')
const port = 1337;
let server;

const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'masterkey',
  database: 'qa_test_sdc'
});

beforeAll(() => {
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`QA-API test server listening at http://localhost:${port}`);
      client.connect()
      .then(() => {
        resolve();
      })
    })
  });

});

beforeEach((done) => {
  client.query(schema)
  .then(() => {
    done();
  });
});

afterAll(() => {
  server.close();
  client.end();
})

describe ('server unit tests', () => {

  it('Should test Jest connection', () => {
    expect('working').toBe('working');
  });

  it('Should fetch the first entry in the questions table and check that the values match those inserted by the schema.', async () => {

    let res = await request(app)
      .get('/qa/questions/?product_id=1')
      expect(res.body.results[0].question_body).toBe('Is this good?');

  });

})