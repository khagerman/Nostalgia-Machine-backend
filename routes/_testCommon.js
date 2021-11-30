"use strict";

const db = require("../db.js");
const Decade = require("../models/decade");
const Post = require("../models/posts");
const User = require("../models/users");
const Comment = require("../models/comments");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM decade_posts");
  await db.query("DELETE FROM user_memory");
  await db.query("DELETE FROM post");
  await db.query("DELETE FROM comments");
  await db.query("DELETE FROM decade");

  await db.query(`
      INSERT INTO decade (name, description, id)
  VALUES ('1960s', 'test test', 1),
   ('1970s', 'test test', 2),
   ('1980s','test test', 3),
   ('1990s','test test', 4),
   ('2000s', 'test test', 5)`);

  await User.register({
    username: "u1",
    password: "password1",
  });
  await User.register({
    username: "u2",
    password: "password2",
  });
  await db.query(
    `
    INSERT INTO post (title, url, username, decade_id, id)
   VALUES ('Doodle Bear', 'https://i.ytimg.com/vi/PHc_02as3_c/sddefault.jpg', 'u1', 4, 12),
   ('Dresses from Sears', 'https://i.pinimg.com/564x/a4/fb/bd/a4fbbd85e51a0319ab0583faeec9f99b.jpg', 'u2', 1,13),
   ('Beer Shampoo', 'https://i.pinimg.com/564x/f3/57/e4/f357e4710747cffbb0df3dbfef27cdd5.jpg', 'u2', 2,14),
   ('Tandy Electronics', 'https://i.pinimg.com/564x/02/33/7c/02337cf0f7e03bb501a308f3a1ed867b.jpg', 'u1', 3,15),
   ('Silly Bands', 'https://i.pinimg.com/564x/ce/84/62/ce84625abc95c70725109d99cdc9db07.jpg', 'u2', 5,16)
    `
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "u1" });
const u2Token = createToken({ username: "u2" });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
};
