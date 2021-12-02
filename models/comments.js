const db = require("../db");
const { NotFoundError, UnauthorizedError } = require("../expressError");

class Comment {
  /** Create a comment (from data), update db, return new comment
   *
   * data should be { title, url, post_id }
   *
   * Returns { id, text, created, username, post_id }
   **/

  static async create(data, username, post_id) {
    const result = await db.query(
      `INSERT INTO comments (text, username, post_id )
           VALUES ($1, $2, $3)
           RETURNING id, text, created, username, post_id`,
      [data.text, username, post_id]
    );
    let comment = result.rows[0];

    return comment;
  }

  /** Find comment by id (
   *
  
   *
   * Returns [{id, text, created, username, post_id}]
   * */

  static async get(id) {
    let result = await db.query(
      `SELECT id, text, created, username, post_id FROM comments WHERE id =$1
    `,
      [id]
    );

    let comment = result.rows[0];

    if (!comment) throw new NotFoundError(`No post ${id}`);

    return comment;
  }

  /** Update comment text data with `data`.
   *
   *
   *
   * Returns {id, text, created, username, post_id}
   *  Throws UnauthorizedError if logged in user is not the author of post
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data, username) {
    const getUsername = await db.query(
      `SELECT username FROM comments WHERE id=$1
    `,
      [id]
    );
    let author = getUsername.rows[0];

    if (author.username !== username) {
      throw new UnauthorizedError("You must be author to edit a comment");
    }
    const result = await db.query(
      `
      UPDATE comments SET text= $1
      WHERE id = $2
      RETURNING id, text, created, username, post_id
    `,
      [data.text, id]
    );

    let comment = result.rows[0];

    if (!comment) throw new NotFoundError(`No comment ${id}`);

    return comment;
  }

  /** Delete given comment from database; returns id of deleted comment
   * Throws UnauthorizedError if logged in user is not the author of post
   * Throws NotFoundError if comment not found.
   **/

  static async remove(id, username) {
    const getUsername = await db.query(
      `SELECT username FROM comments WHERE id =$1
    `,
      [id]
    );
    let author = getUsername.rows[0];

    if (author.username !== username) {
      throw new UnauthorizedError("You must be author to edit a comment");
    }
    const result = await db.query(
      `DELETE
           FROM comments
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const comment = result.rows[0];

    if (!comment) throw new NotFoundError(`No comment: ${id}`);
  }
}

module.exports = Comment;
