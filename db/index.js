const { Client } = require('pg')
const pgConfig = require('./config.js');

const client = new Client(pgConfig);

client.connect( (err) => {
  if (err) {
    console.log(err)
  }
  console.log('Database connection successful')
});

const listQuestions = async (productId, offset, count) => {

  const sql = `
  SELECT q.question_id, q.question_body, q.question_date, q.asker_name, q.questions_helpfulness, q.reported, a.answer_id, a.answer_body, a.answer_date, a.answerer_name, a.answer_helpfulness, p.photo_id, p.answer_id, p.photo_url
  FROM questions q
  LEFT JOIN answers a ON a.question_id = q.question_id
  LEFT JOIN photos p ON p.answer_id = a.answer_id
  WHERE product_id = ${productId} AND q.reported = 'f' LIMIT ${count} OFFSET ${offset}
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
    'product_id': productId,
    results: resultsArr
  }

  return ret;

};

const listAnswers = async (questionId, offset, count) => {

  const sql = `SELECT a.answer_id, a.answer_body, a.answer_date, a.answerer_name, a.answer_helpfulness, p.photo_id, p.answer_id, p.photo_url FROM answers a
  LEFT JOIN photos p ON p.answer_id = a.answer_id
  WHERE question_id = ${questionId} AND reported = 'f' LIMIT ${count} OFFSET ${offset}`;

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
    'question_id': questionId,
    results: resultsArr
  }

  return ret;

};

const addQuestion = async (questionBody, askerName, askerEmail, questionDate, prodId) => {

  const sql = `INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email) VALUES (${prodId}, '${questionBody}', '${questionDate}', '${askerName}', '${askerEmail}')`;

  let dbRes = await client.query(sql);

  return dbRes;
};

const addAnswer = async (answerBody, answererName, answererEmail, answerDate, photos, questionId) => {

  const sql1 = `INSERT INTO answers (question_id, answer_body, answer_date, answerer_name, answerer_email)
  VALUES (${questionId}, '${answerBody}', '${answerDate}', '${answererName}', '${answererEmail}')`;

  const sql2 = `SELECT answer_id FROM answers WHERE question_id = ${questionId} AND answer_date = '${answerDate}'`;

  client.query(sql1)
  .then(() => {
    return client.query(sql2);
  })
  .then((dbRes) => {
    let answerId = dbRes.rows[0].answer_id;
    return photos.forEach( async (photo) => {
      let sql3 = `INSERT INTO photos (photo_url, answer_id) VALUES ('${photo}', ${answerId})`;
      dbRes = await client.query(sql3);
      console.log("INSERTED PHOTO")
      return dbRes;
    })
  })
  .catch((err) => {
    return err;
  })

};

const markQuestionHelpful = async (questionId) => {

  const sql = `UPDATE questions SET questions_helpfulness = questions_helpfulness + 1 WHERE question_id = ${questionId}`;

  let dbRes = await client.query(sql);

  return dbRes;
}

const markAnswerHelpful = async (answerId) => {

  const sql = `UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE answer_id = ${answerId}`;

  let dbRes = await client.query(sql);

  return dbRes;

}

const reportQuestion = async (questionId) => {

  const sql = `UPDATE questions SET reported = 't' WHERE question_id = ${questionId}`;

  let dbRes = await client.query(sql);

  return dbRes;
}

const reportAnswer = async (answerId) => {

  const sql = `UPDATE answers SET reported = 't' WHERE answer_id = ${answerId}`;

  let dbRes = await client.query(sql);

  return dbRes;
}

module.exports = {
  listQuestions,
  listAnswers,
  addQuestion,
  addAnswer,
  markQuestionHelpful,
  markAnswerHelpful,
  reportQuestion,
  reportAnswer,
};