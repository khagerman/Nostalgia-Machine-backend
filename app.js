/** Express app for  nostalgia machine */

const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./Middleware/auth");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const usersRoutes = require("./routes/users");
const decadeRoutes = require("./routes/decade");

const app = express();
app.use(cors());
app.use(express.json());

app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/users", usersRoutes);
app.use("/decade", decadeRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
