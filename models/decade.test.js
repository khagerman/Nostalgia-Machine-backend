"use strict";

const db = require("../db.js");
const { UnauthorizedError, NotFoundError } = require("../expressError");
const Decade = require("./decade.js");
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
let decadeId;
/************************************** create */

describe("create", function () {
  const newDecade = {
    name: "1940s",
    description:
      "The 1940s (commonly abbreviated as the 40s) was a decade of the Gregorian calendar that began on January 1, 1940, and ended on December 31, 1949.Most of World War II took place in the first half of the decade, which had a profound effect on most countries and people in Europe, Asia, and elsewhere.",
  };

  test("works", async function () {
    let decade = await Decade.create(newDecade);
    expect(decade).toEqual(decade);

    const result = await db.query(
      `SELECT id,
                  name,description
           FROM decade
           WHERE id=${decade.id}`
    );
    expect(result.rows[0]).toEqual({
      id: expect.any(Number),
      name: "1940s",
      description:
        "The 1940s (commonly abbreviated as the 40s) was a decade of the Gregorian calendar that began on January 1, 1940, and ended on December 31, 1949.Most of World War II took place in the first half of the decade, which had a profound effect on most countries and people in Europe, Asia, and elsewhere.",
    });
    decadeId = result.rows[0].id;
  });
});
//
// /************************************** get all */
describe("get all", function () {
  test("works", async function () {
    let decades = await Decade.getAll();
    expect(decades).toEqual([
      { description: "test test", id: 1, name: "1960s" },
      { description: "test test", id: 2, name: "1970s" },
      { description: "test test", id: 3, name: "1980s" },
      { description: "test test", id: 4, name: "1990s" },
      { description: "test test", id: 5, name: "2000s" },
    ]);
  });
});
// /************************************** get */

describe("get", function () {
  test("works", async function () {
    let decade = await Decade.get(1);
    expect(decade).toEqual({
      id: expect.any(Number),
      name: "1960s",
      description: "test test",
      posts: [
        {
          id: 13,
          title: "Dresses from Sears",
          url: "https://i.pinimg.com/564x/a4/fb/bd/a4fbbd85e51a0319ab0583faeec9f99b.jpg",
        },
      ],
    });
  });

  test("not found if no such decade", async function () {
    try {
      await Decade.get(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

// /************************************** update */

describe("update", function () {
  test("works", async function () {
    const updateData = {
      name: "new",
      description: "it was a long time ago",
    };
    await Decade.update(2, updateData);

    const res = await db.query(
      `SELECT *
             FROM decade
             WHERE id = 2`
    );
    console.log(res);
    expect(res.rows[0]).toEqual({
      id: expect.any(Number),
      name: "new",
      description: "it was a long time ago",
    });
  });

  test("not found if no such decade", async function () {
    try {
      await Decade.update(0, {
        title: "new text",
      });
      fail();
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Decade.remove(2);
    const res = await db.query(`SELECT id FROM decade WHERE id=2`);
    expect(res.rows.length).toEqual(0);
  });
  test("not found if no such decade", async function () {
    try {
      await Decade.remove(0);
      fail();
    } catch (err) {
      console.log(err);
      expect(err instanceof Error).toBeTruthy();
    }
  });
});
