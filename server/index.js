const express = require('express');
const db = require("../db");

const app = express();
const port = 5000;

app.use(express.json());

app.listen(port, () => {
  console.log(`QA-API server listening at http://localhost:${port}`)
})

// list questions - get - List Questions for product id w/out reported questions
app.get('/qa/questions', async (req, res) => {

  let product_id = req.query.product_id || 1;
  let count = req.query.count || 5;
  let offset;
  req.query.page > 1 ? offset = (count * req.query.page) - count : offset = 0;

  try {
    const ret = await db.listQuestions(product_id, offset, count);
    res.status(200);
    res.json(ret);
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

  let question_id = req.params.question_id;
  let count = req.query.count || 5;
  let offset;
  req.query.page > 1 ? offset = count * req.query.page : offset = 0;

  try {
    const ret = await db.listAnswers(question_id, offset, count);
    res.status(200);
    res.json(ret);
  }
  catch (err) {
    res.status(400);
    res.send('Request failed');
    console.log(err);
  }

});


// add question - post - Adds a question to a product
app.post('/qa/questions', (req, res) => {

  console.log(req.body);

})

// add answer - post - Adds an answer to given question

// mark question helpful - put - Updates a question as helpful

// report question - put - Updates questions to show reported

// mark answer helpful - put - Updates and answer as helpful

// report answer - put - Updates answer to show its been reported
