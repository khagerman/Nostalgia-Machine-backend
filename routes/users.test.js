"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/users");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,

  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /users/:username */

test("works for same user", async function () {
  const resp = await request(app)
    .get(`/users/u1`)
    .set("authorization", `Bearer ${u1Token}`);
  console.log(resp.body);
  expect(resp.body).toEqual({
    user: {
      username: "u1",
      posts: [
        {
          id: 12,
          title: "Doodle Bear",
          url: "https://i.ytimg.com/vi/PHc_02as3_c/sddefault.jpg",
        },
        {
          id: 15,
          title: "Tandy Electronics",
          url: "https://i.pinimg.com/564x/02/33/7c/02337cf0f7e03bb501a308f3a1ed867b.jpg",
        },
      ],
    },
  });
});

test("unauth for other users", async function () {
  const resp = await request(app)
    .get(`/users/u1`)
    .set("authorization", `Bearer ${u2Token}`);
  expect(resp.statusCode).toEqual(401);
});

test("unauth for anon", async function () {
  const resp = await request(app).get(`/users/u1`);
  expect(resp.statusCode).toEqual(401);
});

/************************************** DELETE /users/:username */

describe("DELETE /users/:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .delete(`/users/u1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "u1" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .delete(`/users/u1`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/users/u1`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** POST /users/:username/favorite/:id */

describe("POST /users/:username/favorite/:id", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .post(`/users/u1/favorite/13`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ favoriteAdded: 13 });
  });

  test("unauth for others", async function () {
    const resp = await request(app)
      .post(`/users/u1/favorite/14`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).post(`/users/u1/favorite/14`);

    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such post", async function () {
    const resp = await request(app)
      .post(`/users/u1/favorite/0`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
/************************************** DELETE /users/:username/favorite/:id */
describe("DELETE /users/:username/favorite/:id", function () {
  test("works for same user", async function () {
    await request(app)
      .post(`/users/u1/favorite/13`)
      .set("authorization", `Bearer ${u1Token}`);
    const resp = await request(app)
      .delete(`/users/u1/favorite/13`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ removed: 13 });
  });

  test("unauth if not same user", async function () {
    await request(app)
      .post(`/users/u1/favorite/13`)
      .set("authorization", `Bearer ${u1Token}`);
    const resp = await request(app)
      .delete(`/users/u1/favorite/13`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/users/u1/favorite/13`);
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /users/:username/favorite */
describe("GET /users/:username/favorite", function () {
  test("works for user", async function () {
    await request(app)
      .post(`/users/u1/favorite/13`)
      .set("authorization", `Bearer ${u1Token}`);
    const resp = await request(app)
      .get(`/users/u1/favorite`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      favorites: [
        {
          decade_id: 1,
          id: 13,
          title: "Dresses from Sears",
          url: "https://i.pinimg.com/564x/a4/fb/bd/a4fbbd85e51a0319ab0583faeec9f99b.jpg",
        },
      ],
    });
  });
  test("unauth for not the user", async function () {
    await request(app)
      .post(`/users/u1/favorite/13`)
      .set("authorization", `Bearer ${u1Token}`);
    const resp = await request(app)
      .get(`/users/u1/favorite`)
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });
});
