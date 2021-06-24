DROP DATABASE IF EXISTS questions_answers;

CREATE DATABASE questions_answers;

\c questions_answers;

CREATE TABLE questions(
  id INT NOT NULL,
  product_id INT,
  question_body VARCHAR(1000),
  question_date TEXT,
  asker_name VARCHAR(60),
  asker_email VARCHAR(60),
  reported INT,
  question_helpfulness INT,
  PRIMARY KEY(id)
);

CREATE TABLE answers(
  id INT NOT NULL,
  question_id INT NOT NULL,
  answer_body VARCHAR(1000),
  answer_date TIMESTAMP,
  answerer_name VARCHAR(60),
  answerer_email VARCHAR(60),
  reported BOOLEAN,
  answer_helpfulness INT,
  PRIMARY KEY(id),
  CONSTRAINT fk_question
      FOREIGN KEY(question_id)
	      REFERENCES questions(id)
);

CREATE TABLE photos(
  id INT NOT NULL,
  answer_id INT NOT NULL,
  photo_url TEXT,
  PRIMARY KEY(id),
  CONSTRAINT fk_answer
      FOREIGN KEY(answer_id)
	      REFERENCES answers(id)
);

-- COPY questions(id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
-- FROM '/var/lib/postgresql/questions.csv'
-- DELIMITER ','
-- CSV HEADER;