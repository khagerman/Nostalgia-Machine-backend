const { off } = require("../app");
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
      `SELECT id, title, url, username, decade_id FROM post WHERE id =$1`,
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
  /** Get Most recent posts
   * returns 6 newest posts
   **/
  static async getRecent() {
    const getNew = await db.query(
      `SELECT id, title, url, username FROM post order by id desc limit 6`
    );
    return getNew.rows;
  }
  //  get list of all all ids that are favorited
  //  filter through ids and count how many favorites recieved in frequency obj
  //sort keys by most favorites
  // return top 6 favorites
  static async getMostFavorite() {
    const getFavorites = await db.query(
      `SELECT  post_id
            FROM user_memory`
    );
    let obj = {};
    for (let num of getFavorites.rows) {
      obj[num.post_id] = (obj[num.post_id] += 1) || 1;
    }

    let sorted = Object.keys(obj).sort(function (a, b) {
      return obj[a] - obj[b];
    });
    return sorted.slice(-6).reverse();
  }
}

module.exports = Post;
