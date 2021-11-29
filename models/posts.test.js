"use strict";

const db = require("../db.js");
const { UnauthorizedError, NotFoundError } = require("../expressError");
const Post = require("./posts.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);
let postId;
/************************************** create */

describe("create", function () {
  const newPost = {
    title: "test test test",
    url: "test.com",
    decade_id: 2,
  };

  test("works", async function () {
    let post = await Post.create(newPost, "u1");
    expect(post).toEqual(post);

    const result = await db.query(
      `SELECT *
           FROM post
           WHERE id=${post.id}`
    );
    console.log(result.rows[0]);
    expect(result.rows[0]).toEqual({
      id: expect.any(Number),
      title: "test test test",
      url: "test.com",
      username: "u1",
      decade_id: 2,
    });
    postId = result.rows[0].id;
  });
});

// /************************************** get */

describe("get", function () {
  test("works", async function () {
    let post = await Post.get(13);
    expect(post).toEqual({
      id: 13,
      username: "u2",
      title: "Dresses from Sears",
      url: "https://i.pinimg.com/564x/a4/fb/bd/a4fbbd85e51a0319ab0583faeec9f99b.jpg",
      comments: [],
    });
  });

  test("not found if no such post", async function () {
    try {
      await Post.get(0);
    } catch (err) {
      console.log(err);
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
// /************************************** update */

describe("update", function () {
  test("works", async function () {
    const updateData = {
      title: "new",
      url: "new.com",
    };
    await Post.update(13, updateData, "u2");

    const res = await db.query(
      `SELECT *
             FROM post
             WHERE id = 13`
    );
    console.log(res);
    expect(res.rows[0]).toEqual({
      id: expect.any(Number),
      username: "u2",
      decade_id: 1,
      title: "new",
      url: "new.com",
    });
  });

  test("not found if no such post", async function () {
    try {
      await Post.update(
        0,
        {
          title: "new text",
        },
        "u1"
      );
      fail();
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Post.remove(13, "u2");
    const res = await db.query(`SELECT id FROM post WHERE id=13`);
    expect(res.rows.length).toEqual(0);
  });
  test("error if not author of post", async function () {
    try {
      await Post.remove(13, "u1");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
  test("not found if no such post", async function () {
    try {
      await Post.remove(0, "u2");
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof Error).toBeTruthy();
    }
  });
});
