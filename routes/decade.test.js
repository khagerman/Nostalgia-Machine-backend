"use strict";

const request = require("supertest");

const app = require("../app");

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

/************************************** GET /DECADE */

describe("GET /decade", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/decade");
    console.log(resp.body);
    expect(resp.body).toEqual({
      decades: [
        { id: 1, name: "1960s", description: "test test" },
        { id: 2, name: "1970s", description: "test test" },
        { id: 3, name: "1980s", description: "test test" },
        { id: 4, name: "1990s", description: "test test" },
        { id: 5, name: "2000s", description: "test test" },
      ],
    });
  });

  /************************************** GET /decade/:id */

  describe("GET /decade/:id", function () {
    test("works for anon", async function () {
      const resp = await request(app).get(`/decade/1`);
      console.log(resp.body);
      expect(resp.body).toEqual({
        decade: {
          id: 1,
          name: "1960s",
          description: "test test",
          posts: [
            {
              id: 13,
              title: "Dresses from Sears",
              url: "https://i.pinimg.com/564x/a4/fb/bd/a4fbbd85e51a0319ab0583faeec9f99b.jpg",
            },
          ],
        },
      });
    });
    test("not found for no such decade", async function () {
      const resp = await request(app).get(`/decade/0`);
      expect(resp.statusCode).toEqual(404);
    });
  });
});
