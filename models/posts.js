const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Related functions for companies. */

// TODO add post, delete post, get user id from saved? edit post???

//post comments
class Post {
  /** Create a post (from data), update db, return new job data.
   *
   * data should be { title, url }
   *
   * Returns { id, title, url }
   **/

  ///get username
  //get user id

  static async create(data, id) {
    const result = await db.query(
      `INSERT INTO post (title,
                        url,username  )
           VALUES ($1, $2, $3)
           RETURNING id, title, url`,
      [data.title, data.url, id]
    );
    let post = result.rows[0];

    return post;
  }

  /** Find post by id (
   *
  
   *
   * Returns [{ id, title, url, username, comments:{} }]
   * */

  static async get(id) {
    let result = await db.query(
      `SELECT id, title, url, i_remember, username FROM post WHERE id =$1"
    );`[id]
    );

    let post = result.rows[0];

    if (!post) throw new NotFoundError(`No post ${id}`);
    //    id INTEGER PRIMARY KEY,
    // username INTEGER REFERENCES users ON DELETE SET NULL,
    // post_id INTEGER REFERENCES post ON DELETE CASCADE,
    // text VARCHAR(100),
    // created TIMESTAMP
    let resComments = await db.query(
      `SELECT id, username,text, created FROM comments WHERE post_id = $1
    );`[id]
    );

    return post;
  }

  /** Update decade data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { newName, newDescription }
   *
   * Returns {name, description }
   *
   * Throws NotFoundError if not found.
   */

  //   todo make private

  static async update(id, newTitle, newURL) {
    const result = await db.query(
      `
      UPDATE post SET title = $1, url  = $2 
      WHERE id = $3
      RETURNING id, title, url, username, i_remember
    `,
      [newTitle, newURL, id]
    );

    let post = result.rows[0];

    if (!post) throw new NotFoundError(`No post ${id}`);

    return post;
  }

  /** Delete given post from database; returns undefined.
   *
   * Throws NotFoundError if post not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM post
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const post = result.rows[0];

    if (!post) throw new NotFoundError(`No post: ${id}`);
  }
}

module.exports = Post;
