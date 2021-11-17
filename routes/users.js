"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/users");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");

const router = express.Router();

/** GET /[username] => { user }
 *
 * Returns { username and user's posts }
 *
 *
 * Authorization required:  same user-as-:username
 **/

router.get("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(+req.params.id);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(+req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username]/jobs/[id]  { state } => { application }
 *
 * Returns {"applied": jobId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post(
  "/:userid/favorites/:id",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const postId = +req.params.id;
      await User.addFavorite(+req.params.userid, postId);
      return res.json({ favoriteAdded: +postId });
    } catch (err) {
      return next(err);
    }
  }
);

router.delete(
  "/:userid/favorite/:id",
  ensureCorrectUser,
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const postId = +req.params.id;
      await User.deleteFavorite(+req.params.userid, postId);
      return res.json({ removed: postId });
    } catch (err) {
      return next(err);
    }
  }
);
/** GET /[username] => { user }
 *
 * Returns { username and user's posts }
 *
 *
 * Authorization required:  same user-as-:username
 **/

router.get(
  "/:userid/favorite",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const favorites = await User.getUserFavorites(+req.params.userid);
      return res.json({ favorites });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
