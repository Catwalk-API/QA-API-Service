const { Client } = require('pg')
const pgConfig = require('./config.js');

const client = new Client(pgConfig)

client.connect( (err) => {
  if (err) {
    console.log(err)
  }
  console.log('Database connection successful')
})