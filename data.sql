DROP DATABASE IF EXISTS nostalgia;

CREATE DATABASE nostalgia;

\connect nostalgia


CREATE TABLE users (
  username VARCHAR(30) UNIQUE NOT NULL PRIMARY KEY,
  password VARCHAR(100) NOT NULL 
);


CREATE TABLE decade (
 id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  description VARCHAR(1000)
);


CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) DEFAULT NULL,
  url VARCHAR(2000),
  username VARCHAR(30) REFERENCES users ON DELETE SET NULL
  
  -- createdAt DATETIME NOT NULL,
);

CREATE TABLE decade_posts (
    id SERIAL PRIMARY KEY,
    decade_id INTEGER REFERENCES decade ON DELETE CASCADE,
    post_id INTEGER REFERENCES post ON DELETE CASCADE
);


CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  username REFERENCES users ON DELETE SET NULL,
  post_id INTEGER REFERENCES post ON DELETE CASCADE,
  text VARCHAR(100),
  created TIMESTAMP   
);

CREATE TABLE user_memory (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) REFERENCES users ON DELETE SET NULL,
  post_id INTEGER REFERENCES post ON DELETE CASCADE 
);


INSERT INTO users (username, password)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q'),
       ('testuser2',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q'
       );

INSERT INTO decade (name, description)
VALUES ('1960s', 'test test'),
 ('1970s', 'test test'),
 ('1980s','test test'),
 ('1990s','test test'),
 ('2000s', 'test test');