const express = require('express');
const db = require("../db");

const app = express();
const port = 5000;

app.listen(port, () => {
  console.log(`QA-API server listening at http://localhost:${port}`)
})