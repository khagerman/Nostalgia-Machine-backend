/** Routes for posts. */

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

/** GET /[id] => { post }
 *
 * Returns { "post": {"id" "title, "url","username", "comments":[]
  } }
 *
 *
 * Authorization required:  none
 **/

router.get("/:id", async function (req, res, next) {
  try {
    const post = await Post.get(+req.params.id);
    return res.json({ post });
  } catch (err) {
    return next(err);
  }
});
/** POST /{title,url, decade_id} => { post }
 *
 * Returns { "post": {"id":  "title", "url", decade_id} }
 *
 *
 * Authorization required:  logged in
 **/
router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, postNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = res.locals.user;
    console.log(user);
    const post = await Post.create(req.body, user.username);
    return res.status(201).json({ post });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[postid] { post } => { post}
 *Returns { "post": {"id":  "title", "url", decade_id, username} }
 * Authorization required: same-user-as-username
 **/

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, postUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = res.locals.user;

    const post = await Post.update(req.params.id, req.body, user.username);
    return res.json({ post });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[postid]  =>  { deleted: postid }
 *
 * Authorization required:  same-user-as-username
 **/

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = res.locals.user;
    await Post.remove(+req.params.id, user.username);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});

/** POST /[postid]/comments/
 *create comment on post
 * Returns {comment": {
    "id":
    "text": 
    "created"
    "username"
    "post_id"
  }}
 *
 * Authorization required: logged in
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
/** PATCH /[postid]/comments/commentid
 *edit comment
 * Returns {comment}
 *
 * Authorization required: same-user-as-username
 * */
router.patch(
  "/:id/comments/:commentid",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, commentUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const user = res.locals.user;

      const comment = await Comment.update(
        +req.params.commentid,
        req.body,
        user.username
      );
      return res.json({ comment });
    } catch (err) {
      return next(err);
    }
  }
);
/** DELETE/[postid]/comments/commentid
 *delete comment
 * Returns {deleted:commentid}
 *
 * Authorization required: same-user-as-username
 * */
router.delete(
  "/:id/comments/:commentid",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const user = res.locals.user;
      await Comment.remove(+req.params.commentid, user.username);
      return res.json({ removed: req.params.commentid });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
