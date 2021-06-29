const express = require('express');
const app = express();
app.use(express.json());
const port = 5000;

app.listen(port, () => {
  console.log(`QA-API server listening at http://localhost:${port}`)
})

const db = require("../db");

// list questions - get - List Questions for product id w/out reported questions
app.get('/qa/questions', async (req, res) => {

  let productId = req.query.product_id || 1;
  let count = req.query.count || 5;
  let offset;
  req.query.page > 1 ? offset = (count * req.query.page) - count : offset = 0;

  try {
    const ret = await db.listQuestions(productId, offset, count);
    res.status(200);
    res.send(ret);
  }
  catch (err) {
    res.status(400);
    res.send('Request failed');
    console.log(err);
  }

  res.end()
});

// answers list - get - Return answers for given question w/out reported questions
app.get(`/qa/questions/:question_id/answers`, async (req, res) => {

  let questionId = req.params.question_id;
  let count = req.query.count || 5;
  let offset;
  req.query.page > 1 ? offset = count * req.query.page : offset = 0;

  try {
    const ret = await db.listAnswers(questionId, offset, count);
    res.status(200);
    res.send(ret);
  }
  catch (err) {
    res.status(400);
    res.send('Request failed');
    console.log(err);
  }

});


// add question - post - Adds a question to a product
app.post('/qa/questions', async (req, res) => {

  let reqBody = req.body;
  let questionBody = reqBody.body;
  let askerName = reqBody.name;
  let askerEmail = reqBody.email;
  let prodId = reqBody.product_id;
  let date = new Date();
  questionDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;

  try {
    const ret = await db.addQuestion(questionBody, askerName, askerEmail, questionDate, prodId);
    res.status(201);
    res.send('Database insertion successful');
  }
  catch (err) {
    res.status(400);
    res.send('Request failed');
    console.log(err);
  }

});

// add answer - post - Adds an answer to given question
app.post('/qa/questions/:question_id/answers', async (req, res) => {

  let questionId = req.params.question_id;
  let reqBody = req.body;
  let answerBody = reqBody.body;
  let answererName = reqBody.name;
  let answererEmail = reqBody.email;
  let photos = reqBody.photos;
  let date = new Date();
  answerDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;

  try {
    const ret = await db.addAnswer(answerBody, answererName, answererEmail, answerDate, photos, questionId);
    res.status(201);
    res.send('Database insertion successful');
  }
  catch (err) {
    res.status(400);
    res.send('Request failed');
    console.log(err);
  }

})

// mark question helpful - put - Updates a question as helpful
app.put('/qa/questions/:question_id/helpful', async (req, res) => {

  let questionId = req.params.question_id;

  try {
    const ret = await db.markQuestionHelpful(questionId);
    res.status(204);
    res.end();
  }
  catch (err) {
    res.status(400);
    res.send('Request failed');
    console.log(err);
  }

})

// report question - put - Updates questions to show reported
app.put('/qa/questions/:question_id/report', async (req, res) => {

  let questionId = req.params.question_id;

  try {
    const ret = await db.reportQuestion(questionId);
    res.status(204);
    res.end();
  }
  catch (err) {
    res.status(400);
    res.send('Request failed');
    console.log(err);
  }

})

// mark answer helpful - put - Updates and answer as helpful
app.put('/qa/answers/:answer_id/helpful', async (req, res) => {

  let answerId = req.params.answer_id;

  try {
    const ret = await db.markAnswerHelpful(answerId);
    res.status(204);
    res.end();
  }
  catch (err) {
    res.status(400);
    res.send('Request failed');
    console.log(err);
  }

})

// report answer - put - Updates answer to show its been reported
app.put('/qa/answers/:answer_id/report', async (req, res) => {

  let answerId = req.params.answer_id;

  try {
    const ret = await db.reportAnswer(answerId);
    res.status(204);
    res.end();
  }
  catch (err) {
    res.status(400);
    res.send('Request failed');
    console.log(err);
  }

})

module.exports.app = app;