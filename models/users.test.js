"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./users.js");
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

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("u1", "password1");
    expect(user).toEqual({
      username: "u1",
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("u1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */

describe("register", function () {
  test("works", async function () {
    let user = await User.register({
      username: "new",
      password: "password",
    });
    expect(user).toEqual({ username: "new" });
    const found = await db.query("SELECT * FROM users WHERE username = 'new'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      await User.register({
        username: "u1",
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "u1",
      },
      {
        username: "u2",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let user = await User.get("u1");
    expect(user).toEqual({
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
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove("u1");
    const res = await db.query("SELECT * FROM users WHERE username='u1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      console.log(err, "notfound");
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** addFavorite */

describe("addFavorite", function () {
  test("works", async function () {
    await User.addFavorite("u1", 13);

    const res = await db.query("SELECT * FROM user_memory WHERE post_id=$1", [
      13,
    ]);
    expect(res.rows).toEqual([
      {
        id: expect.any(Number),
        post_id: 13,
        username: "u1",
      },
    ]);
  });

  test("not found if no such post", async function () {
    try {
      await User.addFavorite("u1", 0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("not found if no such user", async function () {
    try {
      await User.addFavorite("nope", 13);
      fail();
    } catch (err) {
      console.log(err, "add fav no user");
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** removeFavorite */

describe("deleteFavorite", function () {
  test("works", async function () {
    await User.addFavorite("u1", 13);
    await User.deleteFavorite("u1", 13);
    const res = await db.query("SELECT * FROM user_memory WHERE post_id=$1", [
      13,
    ]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such post", async function () {
    try {
      await User.deleteFavorite("u1", 0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("not found if no such user", async function () {
    try {
      await User.deleteFavorite("nope", 13);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("error if not liked", async function () {
    try {
      await User.deleteFavorite("u1", 14);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});
/**************************************getUserFavorites */

describe("deleteFavorite", function () {
  test("works", async function () {
    await User.addFavorite("u1", 13);
    await User.addFavorite("u1", 14);
    const res = await User.getUserFavorites("u1");

    expect(res).toEqual([
      {
        id: 13,
        title: "Dresses from Sears",
        url: "https://i.pinimg.com/564x/a4/fb/bd/a4fbbd85e51a0319ab0583faeec9f99b.jpg",
        decade_id: 1,
      },
      {
        id: 14,
        title: "Beer Shampoo",
        url: "https://i.pinimg.com/564x/f3/57/e4/f357e4710747cffbb0df3dbfef27cdd5.jpg",
        decade_id: 2,
      },
    ]);
  });

  test("not found if no such user", async function () {
    try {
      await User.deleteFavorite("nope", 13);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
