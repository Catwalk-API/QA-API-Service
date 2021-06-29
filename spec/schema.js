let schema = `

  DROP TABLE IF EXISTS photos;
  DROP TABLE IF EXISTS answers;
  DROP TABLE IF EXISTS questions;

  CREATE TABLE questions(
    question_id SERIAL NOT NULL PRIMARY KEY,
    product_id INT,
    question_body VARCHAR(1000),
    question_date TEXT,
    asker_name VARCHAR(60),
    asker_email VARCHAR(60),
    reported BOOLEAN DEFAULT 'f',
    questions_helpfulness INT DEFAULT 0
  );

  CREATE TABLE answers(
    answer_id SERIAL NOT NULL PRIMARY KEY,
    question_id INT NOT NULL,
    answer_body VARCHAR(1000),
    answer_date TEXT,
    answerer_name VARCHAR(60),
    answerer_email VARCHAR(60),
    reported BOOLEAN DEFAULT 'f',
    answer_helpfulness INT DEFAULT 0,
    FOREIGN KEY(question_id)
      REFERENCES questions(question_id)
  );

  CREATE TABLE photos(
    photo_id SERIAL NOT NULL PRIMARY KEY,
    answer_id INT NOT NULL,
    photo_url TEXT,
    FOREIGN KEY(answer_id)
      REFERENCES answers(answer_id)
  );

  INSERT INTO questions (product_id, question_body, question_date, asker_name, asker_email) VALUES (1, 'Is this goob?', '1624813293323', 'John', 'john@email.com');

  INSERT INTO answers (question_id, answer_body, answer_date, answerer_name, answerer_email) VALUES (1, 'I loved it!','1624813467177', 'Sally', 'sally@email.com');

  INSERT INTO photos (answer_id, photo_url) VALUES (1, 'picture.com');

  UPDATE questions
  SET question_date = to_timestamp(questions.question_date::numeric/1000);

  UPDATE answers
  SET answer_date = to_timestamp(answers.answer_date::numeric/1000);

  SELECT setval('questions_question_id_seq', (SELECT MAX(question_id) FROM questions));
  SELECT setval('answers_answer_id_seq', (SELECT MAX(answer_id) FROM answers));
  SELECT setval('photos_photo_id_seq', (SELECT MAX(photo_id) FROM photos));
  `;

  module.exports.schema = schema;
