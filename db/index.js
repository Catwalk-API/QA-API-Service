const { Client } = require('pg')
const pgConfig = require('./config.js');

const client = new Client(pgConfig)

client.connect( (err) => {
  if (err) {
    console.log(err)
  }
  console.log('Database connection successful')
})

const listQuestions = async (product_id, offset, count) => {

  const sql = `
  SELECT q.question_id, q.question_body, q.question_date, q.asker_name, q.questions_helpfulness, q.reported, a.answer_id, a.answer_body, a.answer_date, a.answerer_name, a.answer_helpfulness, p.photo_id, p.answer_id, p.photo_url
  FROM questions q
  LEFT JOIN answers a ON a.question_id = q.question_id
  LEFT JOIN photos p ON p.answer_id = a.answer_id
  WHERE product_id = ${product_id} AND q.reported = 'f' LIMIT ${count} OFFSET ${offset}
  `;

  let dbRes = await client.query(sql);

  let store = [];
  let resultsArr = [];
  let resultObj;

  for (let i = 0; i < dbRes.rows.length; i++) {

    let row = dbRes.rows[i];

    if (!store.includes(row.question_id)) {
      store.push(row.question_id);

      resultObj = {
        question_id: row.question_id,
        question_body: row.question_body,
        question_date: row.question_date,
        asker_name: row.asker_name,
        questions_helpfulness: row.questions_helpfulness,
        reported: row.reported,
        answers: {}
      }

      if (row.answer_id) {

        resultObj.answers[row.answer_id] = {
          answer_id: row.answer_id,
          answer_body: row.answer_body,
          answer_date: row.answer_name,
          answerer_name: row.answerer_name,
          answer_helpfulness: row.answer_helpfulness,
          photos: []
        }

        if (row.photo_id) {
          resultObj.answers[row.answer_id].photos.push(row.photo_url);
        }

      }

      resultsArr.push(resultObj);

    } else {

      let index = resultsArr.indexOf(resultObj);

      if (!resultsArr[index].answers[row.answer_id]) {

        resultsArr[index].answers[row.answer_id] = {
          answer_id: row.answer_id,
              answer_body: row.answer_body,
              answer_date: row.answer_name,
              answerer_name: row.answerer_name,
              answer_helpfulness: row.answer_helpfulness,
              photos: []
        }

      }

        if (row.photo_id) {

          resultsArr[index].answers[row.answer_id].photos.push(row.photo_url);

        }

    }
  }

  let ret = {
    'product_id': product_id,
    results: resultsArr
  }

  return ret;

}

const listAnswers = async (question_id, offset, count) => {

  const sql = `SELECT a.answer_id, a.answer_body, a.answer_date, a.answerer_name, a.answer_helpfulness, p.photo_id, p.answer_id, p.photo_url FROM answers a
  LEFT JOIN photos p ON p.answer_id = a.answer_id
  WHERE question_id = ${question_id} AND reported = 'f' LIMIT ${count} OFFSET ${offset}`;

  let dbRes = await client.query(sql);

  let store = [];
  let resultsArr = [];
  let resultObj;

  for (let i = 0; i < dbRes.rows.length; i++) {

    let row = dbRes.rows[i];

    if (!store.includes(row.answer_id)) {
      store.push(row.answer_id);

      resultObj = {
        answer_id: row.answer_id,
        answer_body: row.answer_body,
        answer_date: row.answer_name,
        answerer_name: row.answerer_name,
        answer_helpfulness: row.answer_helpfulness,
        photos: []
      }

      if (row.photo_id) {
        resultObj.photos.push(row.photo_url);
      }

      resultsArr.push(resultObj);

    } else {

      let index = resultsArr.indexOf(resultObj);

        if (row.photo_id) {

          resultsArr[index].photos.push(row.photo_url);

        }

    }
  }

  let ret = {
    'question_id': question_id,
    results: resultsArr
  }

  return ret;
  // return dbRes;

}

module.exports = {
  listQuestions,
  listAnswers,
}