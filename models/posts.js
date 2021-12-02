const db = require("../db");
const { NotFoundError, UnauthorizedError } = require("../expressError");

/** Related functions for posts */

class Post {
  /** Create a post (from data), update db, return new post data.
   *
   * data should be { title, url, decade_id }
   *
   * Returns { id, title, url, decade_id}
   **/

  static async create(data, username) {
    const result = await db.query(
      `INSERT INTO post (title,
                        url,username,decade_id  )
           VALUES ($1, $2, $3, $4)
           RETURNING id, username, title, url, decade_id`,
      [data.title, data.url, username, data.decade_id]
    );
    let post = result.rows[0];

    return post;
  }

  /** Find post by id (
   *
   *Throws NotFoundError if not found.
   * Returns [{ id, title, url, username, comments:{} }]
   * */

  static async get(id) {
    let result = await db.query(
      `SELECT id, title, url, username FROM post WHERE id =$1`,
      [id]
    );

    let post = result.rows[0];

    if (!post) throw new NotFoundError(`No post ${id}`);

    let resComments = await db.query(
      `SELECT id, username,text, created FROM comments WHERE post_id = $1`,
      [id]
    );
    post.comments = resComments.rows;
    return post;
  }

  /** Update post data with `data`.
   *
 
   *
   * Data can include: { title, url }
   *
   * Returns {name, description }
   *
   * Throws NotFoundError if not found.
   * Throws UnauthorizedError if logged in user is not the author
   */

  static async update(id, data, username) {
    const getUsername = await db.query(
      `SELECT username FROM post WHERE id=$1`,
      [id]
    );

    let author = getUsername.rows[0];

    if (author.username !== username) {
      throw new UnauthorizedError("You must be author to edit a post");
    }
    const result = await db.query(
      `
      UPDATE post SET title=$1, url=$2 
      WHERE id=$3
      RETURNING id, title, url, username`,
      [data.title, data.url, id]
    );

    let post = result.rows[0];

    if (!post) throw new NotFoundError(`No post ${id}`);

    return post;
  }

  /** Delete given post from database; returns undefined.
   * 
   *Throws UnauthorizedError if logged in user is not the author
   
   * Throws NotFoundError if post not found.
   **/

  static async remove(id, username) {
    const getUsername = await db.query(
      `SELECT username FROM post WHERE id=$1`,
      [id]
    );
    let author = getUsername.rows[0];

    if (author.username !== username) {
      throw new UnauthorizedError("You must be author to edit a post");
    }
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
