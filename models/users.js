const db = require("../db");
const bcrypt = require("bcrypt");

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */
//todo add admin???
class User {
  /** authenticate user with username, password.
   *
   * Returns {id, username}
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT  username,
                  password,
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, password }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, password }) {
    const duplicateCheck = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
           (username,
            password)
           VALUES ($1, $2)
           RETURNING username`,
      [username, hashedPassword]
    );

    const user = result.rows[0];

    return user;
  }

  /** Find all users.
   *
   * Returns [{ username}, ...]
   **/

  static async findAll() {
    const result = await db.query(
      `SELECT username,
           FROM users
           ORDER BY username`
    );

    return result.rows;
  }

  /** Given a username, return data about user.
   *
   * Returns { username,posts, likes}
   *
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
           FROM users
           WHERE username= $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    const userPosts = await db.query(
      `SELECT id, title, url
           FROM post 
           WHERE post.username = $1`,
      [username]
    );

    user.posts = userPosts.rows.map((p) => p.id);
    return user;
  }

  //
  /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [id]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${id}`);
  }

  /**Add a favorite: update db, returns undefined.
   *
   *
   **/
  //todo make add a favortie
  static async addFavorite(username, post_id) {
    const preCheck = await db.query(
      `SELECT id
           FROM post
           WHERE id = $1`,
      [post_id]
    );
    const post = preCheck.rows[0];

    if (!job) throw new NotFoundError(`No post: ${post_id}`);

    const preCheck2 = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username]
    );
    const user = preCheck2.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
    const duplicateCheck = await db.query(
      `SELECT username, post_id
            FROM user_memory
            WHERE username = $1 AND post_id = $2`,
      [username, post_id]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`User ${username} already liked'${post_id}'`);
    await db.query(
      `INSERT INTO user_memory (username, post_id)
           VALUES ($1, $2)`,
      [username, post_id]
    );
  }
  /**delete a favorite: update db, returns undefined.
   *
   *
   **/
  //todo delete a favortie
  static async deleteFavorite(username, post_id) {
    const preCheck = await db.query(
      `SELECT id
           FROM post
           WHERE id = $1`,
      [post_id]
    );
    const post = preCheck.rows[0];

    if (!post) throw new NotFoundError(`No post: ${post_id}`);

    const preCheck2 = await db.query(
      `SELECT username
           FROM users
           WHERE username = $1`,
      [username]
    );
    const user = preCheck2.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
    const likedCheck = await db.query(
      `SELECT username, post_id
            FROM user_memory
            WHERE username = $1 AND post_id = $2`,
      [username, post_id]
    );

    if (!duplicateCheck.rows[0])
      throw new BadRequestError(`User ${username} never liked'${post_id}'`);
    await db.query(
      `DELETE
           FROM user_memory
           WHERE username = $1 AND post_id = $2
           RETURNING username, post_id`,
      [username, post_id]
    );
  }

  /**get all users favorites
   *
   *returns {//todo}
   **/
  static async getUserFavorites(username) {
    let result = await db.query(
      `SELECT id, title, url
             FROM posts
             LEFT JOIN user_memory
               ON post.id = post_id
               LEFT JOIN user
            WHERE username= $1`,
      [username]
    );
    const favorites = result.rows;

    if (!favorites) throw new NotFoundError(`No user favorites`);
    return favorites;
  }
}

module.exports = User;
