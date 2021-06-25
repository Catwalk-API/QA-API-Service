DROP DATABASE IF EXISTS questions_answers;

CREATE DATABASE questions_answers;

\c questions_answers;

CREATE TABLE questions(
  id serial INT NOT NULL,
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
  id serial INT NOT NULL,
  question_id INT NOT NULL,
  answer_body VARCHAR(1000),
  answer_date TEXT,
  answerer_name VARCHAR(60),
  answerer_email VARCHAR(60),
  reported INT,
  answer_helpfulness INT,
  PRIMARY KEY(id),
  FOREIGN KEY(question_id)
	  REFERENCES questions(id)
);

CREATE TABLE photos(
  id serial INT NOT NULL,
  answer_id INT NOT NULL,
  photo_url TEXT,
  PRIMARY KEY(id),
  FOREIGN KEY(answer_id)
	  REFERENCES answers(id)
);

COPY questions(id, product_id, question_body, question_date, asker_name, asker_email, reported, question_helpfulness)
FROM '/var/lib/postgresql/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers(id, question_id, answer_body, answer_date, answerer_name, answerer_email, reported, answer_helpfulness)
FROM '/var/lib/postgresql/answers.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id, answer_id, photo_url)
FROM '/var/lib/postgresql/answers_photos.csv'
DELIMITER ','
CSV HEADER;

UPDATE questions
SET question_date = to_timestamp(questions.question_date::numberic/1000);

UPDATE answers
SET answer_date = to_timestamp(questions.question_date::numberic/1000);