/** Routes for users. */
//todo check order of params, check for + on numbers, schemas
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

/** GET /[username] => { user }
 *
 * Returns { username and user's posts }
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
 *   { jobs: [ { id, title, salary, equity, companyHandle, companyName }, ...] }
 *
 * Can provide search filter in query:
 * - minSalary
 * - hasEquity (true returns only jobs with equity > 0, other values ignored)
 * - title (will find case-insensitive, partial matches)

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
