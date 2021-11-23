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
 * Returns {"user": { "username": "posts": [] }}
 *
 *
 * Authorization required:  same user-as-:username
 **/

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});
/** DELETE /[username] => { deleted }
 *
 * Returns {deleted:username}
 *
 *
 * Authorization required:  same user-as-:username
 **/
router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

/** POST /[username]/favorite/[id]
 *
 * Returns {"favoriteAdded": postId}
 *
 * Authorization required: same-user-as-:username
 * */

router.post(
  "/:username/favorite/:id",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const postId = +req.params.id;
      await User.addFavorite(req.params.username, postId);
      return res.json({ favoriteAdded: +postId });
    } catch (err) {
      return next(err);
    }
  }
);
/** DELETE /[username]/favorite/[id]
 *
 * Returns {"removed": postId}
 *
 * Authorization required: same-user-as-:username
 * */
router.delete(
  "/:username/favorite/:id",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const postId = +req.params.id;
      await User.deleteFavorite(req.params.username, postId);
      return res.json({ removed: postId });
    } catch (err) {
      return next(err);
    }
  }
);
/** GET /[username] => { favorites}
 *
 * Returns { favorites:[{"id","title", "url", "decade_id" }...] }
 *
 *
 * Authorization required:  same user-as-:username
 **/

router.get(
  "/:username/favorite",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const favorites = await User.getUserFavorites(req.params.username);
      return res.json({ favorites });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
