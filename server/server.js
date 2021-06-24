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

streamQuestions = () => {
  const fileName = './../csv/questions.csv';
  const filePath = path.join(__dirname, fileName);

  const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

  let count = 0;
  let lineRemainder = '';

  readStream.on('data', (chunk) => {
    readStream.pause();
    count++;
    let lines = chunk.split('\n');
    lines[0] = lineRemainder + lines[0];
    lineRemainder = lines.pop();
    let firstLine = lines[0];


    lines.forEach((line) => {
      const values = line.split(',');
      const id = values[0];
      const product_id = values[1];
      const question_body = values[2];
      const unixTimestamp = values[3];
      const asker_name = values[4];
      const asker_email = values[5];
      const reported = values[6];
      const question_helpfulness = values[7];
      const milliseconds = unixTimestamp * 1000;
      const dateObject = new Date(milliseconds);
      const question_date = dateObject.toLocaleString();

      console.log(id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness);
    })
  })
}

streamQuestions();



// readStream.on('end', () => {
//   console.log(count);
// })



  //   // let sql = `INSERT INTO questions (id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness) VALUES (${id}, ${product_id}, '${question_body}', '${question_date}', '${asker_name}', '${asker_email}', ${reported}, ${question_helpfulness})`

  //   // client.query(sql, (err, dbResponse) => {
  //   //   if (err) {
  //   //     console.log(err);
  //   //   } else {
  //   //     console.log('response: ', dbResponse);
  //   //   }
  //   // })