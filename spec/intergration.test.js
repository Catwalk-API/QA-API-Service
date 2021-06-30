const request = require("supertest");
const { app } = require('./../server');
const { schema } = require('./schema.js')
let { listAnswers, addQuestion } = require('./../db')
const port = 5001;
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

describe ('server and database integration test', () => {

  it('Should test Jest connection', () => {
    expect('working').toBe('working');
  });

})