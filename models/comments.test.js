"use strict";

const db = require("../db.js");
const { UnauthorizedError, NotFoundError } = require("../expressError");
const Comment = require("./comments.js");
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
let commentId;
/************************************** create */

describe("create", function () {
  const newComment = {
    text: "awwww",
  };

  test("works", async function () {
    let comment = await Comment.create(newComment, "u1", 12);
    expect(comment).toEqual(comment);

    const result = await db.query(
      `SELECT *
           FROM comments`
    );
    expect(result.rows[0]).toEqual({
      text: "awwww",
      id: expect.any(Number),
      created: null,
      post_id: 12,
      username: "u1",
    });
    commentId = result.rows[0].id;
  });
});
//

// /************************************** get */

describe("get", function () {
  test("works", async function () {
    const newComment = {
      text: "awwww",
    };

    await Comment.create(newComment, "u1", 12);

    const result = await db.query(
      `SELECT *
           FROM comments`
    );
    commentId = result.rows[0].id;

    let comment = await Comment.get(commentId);
    expect(comment).toEqual({
      text: "awwww",
      id: expect.any(Number),
      created: null,
      post_id: 12,
      username: "u1",
    });
  });

  test("not found if no such comment", async function () {
    try {
      await Comment.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** update */

describe("update", function () {
  test("works", async function () {
    const newComment = {
      text: "awwww",
    };

    Comment.create(newComment, "u1", 12);

    const result = await db.query(
      `SELECT *
           FROM comments`
    );
    commentId = result.rows[0].id;

    const updateData = {
      text: "new text",
    };
    await Comment.update(commentId, updateData, "u1");

    console.log(commentId);
    const res = await db.query(
      `SELECT *
           FROM comments
           WHERE id = ${commentId}`
    );
    expect(res.rows[0]).toEqual({
      text: "new text",
      id: expect.any(Number),
      created: null,
      post_id: 12,
      username: "u1",
    });
  });

  test("not found if no such comment", async function () {
    try {
      await Comment.update(
        0,
        {
          text: "new text",
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
    const newComment = {
      text: "awwww",
    };

    await Comment.create(newComment, "u1", 12);

    const result = await db.query(
      `SELECT *
           FROM comments`
    );
    commentId = result.rows[0].id;
    await Comment.remove(commentId, "u1");
    const res = await db.query(`SELECT id FROM comments WHERE id=${commentId}`);
    expect(res.rows.length).toEqual(0);
  });
  test("error if wrong user", async function () {
    try {
      const newComment = {
        text: "awwww",
      };

      await Comment.create(newComment, "u1", 12);

      const result = await db.query(
        `SELECT *
           FROM comments`
      );
      commentId = result.rows[0].id;
      await Comment.remove(commentId, "u2");
    } catch (err) {
      console.log(err);
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
  test("not found if no such comment", async function () {
    try {
      await Comment.remove(0, "u1");
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof Error).toBeTruthy();
    }
  });
});
