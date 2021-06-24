const fs = require('fs');
const path = require('path');

const fileName = 'answers.csv';
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
    console.log(values)
  })
})

readStream.on('end', () => {
  console.log(count);
})