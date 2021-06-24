const express = require('express');
const app = express();
const port = 5000;
const fs = require('fs');
const path = require('path');

const { Client } = require('pg')
const client = new Client({
  user: 'alex',
  database: 'questions_answers',
  password: 'masterkey'
})
client.connect()

const fileName = './../csv/questions.csv';
const filePath = path.join(__dirname, fileName);
const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
let lineRemainder = '';

streamQuestions = () => {
  readStream.on('data', (chunk) => {
    readStream.pause();
    let lines = chunk.split('\n');
    lines[0] = lineRemainder + lines[0];
    lineRemainder = lines.pop();
    let firstLine = lines[0];

    lines.forEach((line) => {
      const values = line.split(',');
      const id = values[0];
      const product_id = values[1];
      const question_body = values[2];
      const timestamp = Number(values[3]);
      const dateObject  = new Date(timestamp);
      const question_date = dateObject.toLocaleString();
      const asker_name = values[4];
      const asker_email = values[5];
      const reported = Boolean(Number(values[6]));
      const question_helpfulness = values[7];

      let sql = `INSERT INTO questions (id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) VALUES (${id}, ${product_id}, '${question_body}', '${question_date}', '${asker_name}', '${asker_email}', ${reported}, ${question_helpfulness})`

      client.query(sql, (err, dbResponse) => {
        if (err) {
          console.log(err);
        } else {
          console.log('response: ', dbResponse);
        }
      })

      // console.log(id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness);
    })
  })
}

readStream.on('end', () => {
  console.log('Done uploading');
})

streamQuestions();