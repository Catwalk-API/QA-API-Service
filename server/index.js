const express = require('express');
const db = require("../db");

const app = express();
const port = 5000;

app.listen(port, () => {
  console.log(`QA-API server listening at http://localhost:${port}`)
})

// list questions - get - List Questions for product id w/out reported questions
app.get('/qa/questions', async (req, res) => {

  let product_id = req.query.product_id || 1;
  let count = req.query.count || 5;
  let offset;
  req.query.page > 1 ? offset = count * req.query.page : offset = 0;

  try {
    const ret = await db.listQuestions( product_id, offset, count);
    res.status(200);
    res.json(ret.rows);
  }
  catch (err) {
    res.status(400);
    console.log('failed');
  }

  res.end()
})

// answers list - get - Return answers for given question w/out reported questions

// add question - post - Adds a question to a product

// add answer - post - Adds an answer to given question

// mark question helpful - put - Updates a question as helpful

// report question - put - Updates questions to show reported

// mark answer helpful - put - Updates and answer as helpful

// report answer - put - Updates answer to show its been reported
