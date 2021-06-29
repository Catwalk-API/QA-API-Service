const { Client } = require('pg');
const { schema } = require('./schema.js')

const client = new Client({
  user: 'postgres',
  password: 'masterkey',
  database: 'qa_test_sdc'
});

beforeAll( () => {
    return new Promise((resolve, reject) => {
      client.connect()
      .then(() => {
        resolve();
      })
    })

});

beforeEach((done) => {
  client.query(schema)
  .then(() => {
    done();
  });
});

afterAll(() => {
  client.end();
})

describe('db unit tests', () => {

  it('Should test Jest connection', () => {
    expect('working').toBe('working');
  });

  it('Should fetch the first entry in the questions table and check that the values match those inserted by the schema.', async () => {

    let sql = `SELECT * FROM questions WHERE product_id = 1;`

    let res = await client.query(sql);
      expect(res.rows[0].question_body).toBe('Is this good?');
      expect(res.rows[0].asker_name).toBe('John');
      expect(res.rows[0].question_date).toBe('2021-06-27 13:01:33.323-04');
      expect(res.rows[0].asker_email).toBe('john@email.com');

  });

  it('Should fetch the first entry in the answers table and check that the values match those inserted by the schema.', async () => {

    let sql = `SELECT * FROM answers WHERE question_id = 1;`

    let res = await client.query(sql);
      expect(res.rows[0].answer_body).toBe('I loved it!');
      expect(res.rows[0].answerer_name).toBe('Sally');
      expect(res.rows[0].answer_date).toBe('2021-06-27 13:04:27.177-04');
      expect(res.rows[0].answerer_email).toBe('sally@email.com');

  });

  it('Should fetch the first entry in the photos table and check that the values match those inserted by the schema.', async () => {

    let sql = `SELECT * FROM photos WHERE answer_id = 1;`

    let res = await client.query(sql);
      expect(res.rows[0].photo_url).toBe('picture.com');

  });

})