/** Routes for users. */
//todo check order of params, check for + on numbers, schemas
const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Comment = require("../models/comments");
const Post = require("../models/posts");
const { createToken } = require("../helpers/tokens");
const postNewSchema = require("../schemas/postCreate.json");
const postUpdateSchema = require("../schemas/postUpdate.json");
const commentNewSchema = require("../schemas/commentCreate.json");
const commentUpdateSchema = require("../schemas/commentUpdate.json");
const router = express.Router();

/** GET /[username] => { user }
 *
 * Returns { username and user's posts }
 *
 *
 * Authorization required:  same user-as-:username
 **/

router.get("/:id", async function (req, res, next) {
  try {
    const post = await Post.get(req.params.id);
    return res.json({ post });
  } catch (err) {
    return next(err);
  }
});

// todo need to get decade, add to decade_posts
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, postNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = res.locals.user;
    console.log(user);
    const post = await Post.create(req.body, +user.id);
    return res.status(201).json({ post });
  } catch (err) {
    return next(err);
  }
});

// /** PATCH /[username] { user } => { user }
//  *
//  * Data can include:
//  *   { firstName, lastName, password, email }
//  *
//  * Returns { username, firstName, lastName, email, isAdmin }
//  *
//  * Authorization required: admin or same-user-as-:username
//  **/

router.patch("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, postUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const post = await Post.update(+req.params.id, req.body);
    return res.json({ post });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
  try {
    await Post.remove(+req.params.id);
    return res.json({ deleted: req.params.id });
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

router.post("/:id/comments/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, commentNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = res.locals.user;
    const comment = await Comment.create(
      req.body,
      user.username,
      +req.params.id
    );
    return res.status(201).json({ comment });
  } catch (err) {
    return next(err);
  }
});
router.patch(
  "/:id/comments/:commentid",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, commentUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const comment = await Comment.update(+req.params.id, req.body);
      return res.json({ comment });
    } catch (err) {
      return next(err);
    }
  }
);

router.delete(
  "/:id/comments/:commentid",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      await Comment.remove(+req.params.commentid);
      return res.json({ removed: req.params.commentid });
    } catch (err) {
      return next(err);
    }
  }
);
// /** GET /[username] => { user }
//  *
//  * Returns { username and user's posts }
//  *
//  *
//  * Authorization required:  same user-as-:username
//  **/

// router.get(
//   "/:userid/favorite",
//   ensureCorrectUser,
//   async function (req, res, next) {
//     try {
//       const favorites = await User.getUserFavorites(req.params.userid);
//       return res.json({ favorites });
//     } catch (err) {
//       return next(err);
//     }
//   }
// );

module.exports = router;
