/** Shared config for application; can be required many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-secret";

const PORT = +process.env.PORT || 3001;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "nostalgia_test"
    : process.env.DATABASE_URL || "nostalgia";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
