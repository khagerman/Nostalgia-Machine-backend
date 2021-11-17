//todo get all decades, update decade, add decade, remove decade
//todo make private probably
const db = require("../db");
const { NotFoundError } = require("../expressError");

/** Related functions for decade */

class Decade {
  /** Create a decade (from data), update db, return new decade data.
   *
   * data should be { name, description }
   *
   * Returns { id, name, description }
   **/
  //todo backf=ground image, profile image??
  static async create({ name, description }) {
    const result = await db.query(
      `INSERT INTO decade (name, description)
           VALUES ($1, $2)
           RETURNING id,name,description`,
      [name, description]
    );
    let decade = result.rows[0];

    return decade;
  }

  /** Find all decades (
   *
  
   *
   * Returns [{ id, name, description}]
   * */

  static async getAll() {
    let result = await db.query("SELECT id, name, description FROM decade");
    return result.rows;
  }

  /** Given a decade id, return data about decade.
   *
   * Returns { id, title, description and posts matching id }

   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const decadeRes = await db.query(
      `SELECT id,
                  name,description
           FROM decade
           WHERE id = $1`,
      [id]
    );

    const decade = decadeRes.rows[0];

    if (!decade) throw new NotFoundError(`No decade: ${id}`);
    const postsRes = await db.query(
      `SELECT post.id, title, url, i_remember 
           FROM post
           LEFT JOIN decade_posts
           ON post.id = post_id
           LEFT JOIN decade
           ON decade_id = $1;`,
      [id]
    );
    decade.posts = postsRes.rows[0];
    return decade;
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

  static async update(id, newName, newDescription) {
    const result = await db.query(
      `
      UPDATE decade SET name = $1, description  = $2 
      WHERE id = $3
      RETURNING id, name, description
    `,
      [newName, newDescription, id]
    );

    let decade = result.rows[0];

    if (!decade) throw new NotFoundError(`No decade ${id}`);

    return decade;
  }

  /** Delete given decade from database; returns undefined.
   *
   * Throws NotFoundError if decade not found.
   **/
  //   todo make private
  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM decade
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const decade = result.rows[0];

    if (!decade) throw new NotFoundError(`No decade: ${id}`);
  }
}

module.exports = Decade;
