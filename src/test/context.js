const pool = require("../pool");
const { randomBytes } = require("crypto");
const { default: migrate } = require("node-pg-migrate");
const format = require("pg-format");

const DEFAULT_OPTIONS = {
  host: "localhost",
  port: 5432,
  database: "socialnetwork-test",
  user: "postgres",
  password: "admin",
};

class Context {
  static async build() {
    // generate a random role name to connect to PG
    const roleName = "a" + randomBytes(4).toString("hex");

    // connect to PG
    await pool.connect(DEFAULT_OPTIONS);

    // create new role
    await pool.query(
      format("CREATE ROLE %I WITH LOGIN PASSWORD %L;", roleName, roleName)
    );

    // crate a schema with the same name
    await pool.query(
      format("CREATE SCHEMA %I AUTHORIZATION %I;", roleName, roleName)
    );

    // disconnect from PG
    await pool.close();

    // run migration in the new schema
    await migrate({
      schema: roleName,
      direction: "up",
      log: () => {},
      noLock: true,
      dir: "migrations",
      databaseUrl: {
        host: "localhost",
        port: 5432,
        database: "socialnetwork-test",
        user: roleName,
        password: roleName,
      },
    });

    // connect as newly created role
    await pool.connect({
      host: "localhost",
      port: 5432,
      database: "socialnetwork-test",
      user: roleName,
      password: roleName,
    });

    return new Context(roleName);
  }

  async reset() {
    return pool.query("DELETE FROM users;");
  }

  async close() {
    await pool.close();

    await pool.connect(DEFAULT_OPTIONS);

    await pool.query(format("DROP SCHEMA %I CASCADE;", this.roleName));

    await pool.query(format("DROP ROLE %I;", this.roleName));

    await pool.close();
  }

  constructor(roleName) {
    this.roleName = roleName;
  }
}

module.exports = Context;
