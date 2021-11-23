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
  url VARCHAR(20000),
  username VARCHAR(30) REFERENCES users ON DELETE SET NULL,
  decade_id INTEGER REFERENCES decade ON DELETE SET NULL
  -- createdAt DATETIME NOT NULL,
);

CREATE TABLE decade_posts (
    id SERIAL PRIMARY KEY,
    decade_id INTEGER REFERENCES decade ON DELETE CASCADE,
    post_id INTEGER REFERENCES post ON DELETE CASCADE
);


CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) REFERENCES users ON DELETE SET NULL,
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
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Titus.Feil');
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Dax.Maggio');
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Jeanette35');
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Reina_Wilderman97');
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Marvin28');
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Tito_Hilpert');
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Napoleon.Mante');
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Federico_Bernhard14');
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Cleveland.Emard96');
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Amir.Ondricka');
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Lawson17');
insert into "users" ("password", "username") values ('$2b$12$qS.VWC1MCVH9o2jFAhLOFOcLdsoNX4BEuMMEL/zdQgS94yKQjQkcm', 'Nickolas_Langworth42');

INSERT INTO decade (name, description)
VALUES ('1960s', 'test test'),
 ('1970s', 'test test'),
 ('1980s','test test'),
 ('1990s','test test'),
 ('2000s', 'test test');

 INSERT INTO post (title, url, username, decade_id)
 VALUES ('Doodle Bear', 'https://i.ytimg.com/vi/PHc_02as3_c/sddefault.jpg', 'Lawson17', 4),
 ('Dresses from Sears', 'https://i.pinimg.com/564x/a4/fb/bd/a4fbbd85e51a0319ab0583faeec9f99b.jpg', 'Titus.Feil', 1),
 ('Beer Shampoo', 'https://i.pinimg.com/564x/f3/57/e4/f357e4710747cffbb0df3dbfef27cdd5.jpg', 'Lawson17', 2),
 ('Tandy Electronics', 'https://i.pinimg.com/564x/02/33/7c/02337cf0f7e03bb501a308f3a1ed867b.jpg', 'Jeanette35', 3),
 ('Silly Bands', 'https://i.pinimg.com/564x/ce/84/62/ce84625abc95c70725109d99cdc9db07.jpg', 'Lawson17', 5);
 