/** Routes for decade. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

const Decade = require("../models/decade");
const { createToken } = require("../helpers/tokens");
const postNewSchema = require("../schemas/postCreate.json");
const postUpdateSchema = require("../schemas/postUpdate.json");
const commentNewSchema = require("../schemas/commentCreate.json");
const commentUpdateSchema = require("../schemas/commentUpdate.json");
const router = express.Router();

/** GET /[id] => { decade }
 *
 * Returns { id, name, description, posts:[]}
 *
 *
 * Authorization required:  none
 **/

router.get("/:id", async function (req, res, next) {
  try {
    const decade = await Decade.get(+req.params.id);
    return res.json({ decade });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   {decades:[{
      "id"
      "name"
      "description"
    }...]}

  get all decades
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const decades = await Decade.getAll();
    return res.json({ decades });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
