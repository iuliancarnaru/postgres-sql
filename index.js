const app = require("./src/app");
const pool = require("./src/pool");

pool
  .connect({
    host: "localhost",
    port: 5432,
    database: "socialnetwork",
    user: "postgres",
    password: "admin",
  })
  .then(() => {
    app().listen(4000, () => {
      console.log("Listening on port 4000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
