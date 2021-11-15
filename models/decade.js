//todo get all decades, update decade, add decade, remove decade

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Decade {
  /** Create a decade (from data), update db, return new decade data.
   *
   * data should be { title, salary, equity, companyHandle }
   *
   * Returns { id, title, salary, equity, companyHandle }
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

  /** Find all jobs (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - minSalary
   * - hasEquity (true returns only jobs with equity > 0, other values ignored)
   * - title (will find case-insensitive, partial matches)
   *
   * Returns [{ id, title, salary, equity, companyHandle, companyName }, ...]
   * */

  static async findAll({ minSalary, hasEquity, title } = {}) {
    let query = `SELECT j.id,
                        j.title,
                        j.salary,
                        j.equity,
                        j.company_handle AS "companyHandle",
                        c.name AS "companyName"
                 FROM jobs j 
                   LEFT JOIN companies AS c ON c.handle = j.company_handle`;
    let whereExpressions = [];
    let queryValues = [];

    // For each possible search term, add to whereExpressions and
    // queryValues so we can generate the right SQL

    if (minSalary !== undefined) {
      queryValues.push(minSalary);
      whereExpressions.push(`salary >= $${queryValues.length}`);
    }

    if (hasEquity === true) {
      whereExpressions.push(`equity > 0`);
    }

    if (title !== undefined) {
      queryValues.push(`%${title}%`);
      whereExpressions.push(`title ILIKE $${queryValues.length}`);
    }

    if (whereExpressions.length > 0) {
      query += " WHERE " + whereExpressions.join(" AND ");
    }

    // Finalize query and return results

    query += " ORDER BY title";
    const jobsRes = await db.query(query, queryValues);
    return jobsRes.rows;
  }

  /** Given a decade id, return data about decade.
   *
   * Returns { id, title, salary, equity, companyHandle, company }
   *   where company is { handle, name, description, numEmployees, logoUrl }
   *
   * Throws NotFoundError if not found.
   **/

  //todo get posts by decade

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

    return decade;
  }

  /** Update decade data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { title, salary, equity }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, newName, newDescription) {
    const result = await db.query(
      `
      UPDATE decade SET name = $1, description  = $2 
      WHERE id = $3
      RETURNING id, name, age
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
