"use strict";

const request = require("supertest");

const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /posts/:id */

describe("GET /posts/:id", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/posts/15`);
    console.log(resp.body);
    expect(resp.body).toEqual({
      post: {
        id: 15,
        title: "Tandy Electronics",
        url: "https://i.pinimg.com/564x/02/33/7c/02337cf0f7e03bb501a308f3a1ed867b.jpg",
        username: "u1",
        comments: [],
      },
    });
  });

  test("not found for no such post", async function () {
    const resp = await request(app).get(`/posts/0`);
    expect(resp.statusCode).toEqual(404);
  });
});
/************************************** POST /posts */

describe("POST /posts", function () {
  const newPost = {
    title: "New",
    url: "http://new.img",
    decade_id: 4,
  };

  test("ok for logged in user", async function () {
    const resp = await request(app)
      .post("/posts")
      .send(newPost)
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      post: { ...newPost, id: expect.any(Number), username: "u1" },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).post("/posts").send(newPost);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/posts")
      .send({
        title: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/posts")
      .send({
        ...newPost,
        url: 22222,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});
/************************************** PATCH /posts/:id */

describe("PATCH /posts/:id", function () {
  test("works for creater of post", async function () {
    const resp = await request(app)
      .patch(`/posts/15`)
      .send({
        title: "hahahahahahah",
        url: "http://www.new.com",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      post: {
        id: 15,
        title: "hahahahahahah",
        url: "http://www.new.com",
        username: "u1",
      },
    });
  });

  test("unauth for non author", async function () {
    const resp = await request(app)
      .patch(`/posts/13`)
      .send({
        title: "hahahahahahah",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).patch(`/posts/13`).send({
      title: "djjdjdj",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("Error if no such post", async function () {
    const resp = await request(app)
      .patch(`/posts/0`)
      .send({
        title: "nope",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(500);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
      .patch(`/posts/13`)
      .send({
        url: "not-a-url",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

// /************************************** DELETE /posts/:id */

describe("DELETE /posts/:id", function () {
  test("works for author", async function () {
    const resp = await request(app)
      .delete(`/posts/13`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({ deleted: 13 });
  });

  test("unauth for non-author", async function () {
    const resp = await request(app)
      .delete(`/posts/13`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/posts/13`);
    expect(resp.statusCode).toEqual(401);
  });

  test("Error for no such post", async function () {
    const resp = await request(app)
      .delete(`/posts/0`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});

/************************************** POST /posts/:id/comments */

describe("POST /posts/:id/comments", function () {
  test("works for logged in user", async function () {
    const newComment = {
      text: "cute!!!",
    };
    const resp = await request(app)
      .post(`/posts/13/comments`)
      .send(newComment)
      .set("authorization", `Bearer ${u1Token}`);
    console.log(resp.body);
    expect(resp.body).toEqual({
      comment: {
        id: expect.any(Number),
        text: "cute!!!",
        created: null,
        username: "u1",
        post_id: 13,
      },
    });
  });

  test("unauth not logged in user", async function () {
    const resp = await request(app)
      .post(`/posts/13/comments`)
      .send({ text: "cute!!!" });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such post", async function () {
    const resp = await request(app)
      .post(`/posts/0/comments`)
      .send({ text: "cute!!!" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});
/************************************** PATCH /posts/:id/comments/:commentid */

describe("PATCH /posts/:id/:commentid", function () {
  test("works for creater of comment", async function () {
    const newComment = {
      text: "cute!!!",
    };
    let comment = await request(app)
      .post(`/posts/13/comments`)
      .send(newComment)
      .set("authorization", `Bearer ${u1Token}`);
    const resp = await request(app)
      .patch(`/posts/13/comments/${comment.body.comment.id}`)
      .send({
        text: "not cute :(",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      comment: {
        id: expect.any(Number),
        text: "not cute :(",
        created: null,
        username: "u1",
        post_id: 13,
      },
    });
  });

  test("unauth for non author", async function () {
    const newComment = {
      text: "cute!!!",
    };
    let comment = await request(app)
      .post(`/posts/13/comments`)
      .send(newComment)
      .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app)
      .patch(`/posts/13/comments/${comment.body.comment.id}`)
      .send({
        text: "hahahahahahah",
      })
      .set("authorization", `Bearer ${u2Token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const newComment = {
      text: "cute!!!",
    };
    let comment = await request(app)
      .post(`/posts/13/comments`)
      .send(newComment)
      .set("authorization", `Bearer ${u1Token}`);
    const resp = await request(app)
      .patch(`/posts/13/comments/${comment.body.comment.id}`)
      .send({
        text: "hahahahahahah",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("Error if no such comment", async function () {
    const resp = await request(app)
      .patch(`/posts/13/comments/0`)
      .send({
        text: "nope",
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(500);
  });
});

// /************************************** /posts/:id/comments/:commentid */

describe("DELETE /posts/:id/comments/:commentid", function () {
  test("works for author", async function () {
    const newComment = {
      text: "cute!!!",
    };
    let comment = await request(app)
      .post(`/posts/13/comments`)
      .send(newComment)
      .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app)
      .delete(`/posts/13/comments/${comment.body.comment.id}`)
      .send({
        text: "hahahahahahah",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ removed: `${comment.body.comment.id}` });
  });

  test("unauth for non-author", async function () {
    const newComment = {
      text: "cute!!!",
    };
    let comment = await request(app)
      .post(`/posts/13/comments`)
      .send(newComment)
      .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app)
      .delete(`/posts/13/comments/${comment.body.comment.id}`)
      .send({
        text: "hahahahahahah",
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const newComment = {
      text: "cute!!!",
    };
    let comment = await request(app)
      .post(`/posts/13/comments`)
      .send(newComment)
      .set("authorization", `Bearer ${u1Token}`);

    const resp = await request(app)
      .delete(`/posts/13/comments/${comment.body.comment.id}`)
      .send({
        text: "hahahahahahah",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("Error for no such post", async function () {
    const resp = await request(app)
      .delete(`/posts/13/comments/0`)
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(500);
  });
});
