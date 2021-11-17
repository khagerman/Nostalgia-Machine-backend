//todo new comment, edit comment, delete comment
const db = require("../db");
const { NotFoundError } = require("../expressError");

// CREATE TABLE comments
// (
//   id INTEGER PRIMARY KEY,
//   username INTEGER REFERENCES users ON DELETE SET NULL,
//   post_id INTEGER REFERENCES post ON DELETE CASCADE,
//   text VARCHAR(100),
//   created TIMESTAMP

//post comments
class Comment {
  /** Create a comment (from data), update db, return new comment
   *
   * data should be { title, url }
   *
   * Returns { id, title, url }
   **/

  ///get username
  //get user id
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
      `SELECT id, text, created, username, post_id FROM comments WHERE id =$1"
    );`[id]
    );

    let comment = result.rows[0];

    if (!comment) throw new NotFoundError(`No post ${id}`);
    //    id INTEGER PRIMARY KEY,
    // username INTEGER REFERENCES users ON DELETE SET NULL,
    // post_id INTEGER REFERENCES post ON DELETE CASCADE,
    // text VARCHAR(100),
    // created TIMESTAMP

    return comment;
  }

  /** Update comment text data with `data`.
   *
   *
   *
   * Returns {id, text, created, username, post_id}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, newText) {
    const result = await db.query(
      `
      UPDATE post SET text= $1,
      WHERE id = $2
      RETURNING id, text, created, username, post_id
    `,
      [newText, id]
    );

    let comment = result.rows[0];

    if (!comment) throw new NotFoundError(`No comment${id}`);

    return comment;
  }

  /** Delete given comment from database; returns undefined.
   *
   * Throws NotFoundError if comment not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM comment
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const comment = result.rows[0];

    if (!comment) throw new NotFoundError(`No comment: ${id}`);
  }
}

module.exports = Comment;
