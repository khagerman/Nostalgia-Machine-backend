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

/** GET /new
 *
 * Returns  array of 6 newest posts{ 
  } }
 *
 *
 * Authorization required:  none
 **/

router.get("/new", async function (req, res, next) {
  try {
    const posts = await Post.getRecent();
    return res.json({ posts });
  } catch (err) {
    return next(err);
  }
});
/** GET /loved
 *
 * Returns array of 6 most loved posts { 
  } }
 *
 *
 * Authorization required:  none
 **/
router.get("/loved", async function (req, res, next) {
  try {
    const posts = await Post.getMostFavorite();
    let favorites = [];
    // filters through array of strings representing post id ,
    //  gets post by id and pushes to favorites array
    for (num of posts) {
      favorites.push(await Post.get(+num));
    }
    return res.json({ favorites });
  } catch (err) {
    return next(err);
  }
});
module.exports = router;
