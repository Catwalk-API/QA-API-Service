const { Client } = require('pg')
const pgConfig = require('./config.js');

const client = new Client(pgConfig)

client.connect( (err) => {
  if (err) {
    console.log(err)
  }
  console.log('Database connection successful')
})

const listQuestions = (product_id, offset, count) => {

  const sql = `SELECT * from questions WHERE product_id = ${product_id} LIMIT ${count} OFFSET ${offset}`;
  return client.query(sql);

}

module.exports = {
  listQuestions,
}