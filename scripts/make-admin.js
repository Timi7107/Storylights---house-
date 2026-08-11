const Database = require("better-sqlite3");
const db = new Database("./data/storylights.db");
db.prepare("UPDATE users SET role='admin' WHERE email=?").run("ogunniyaolayinka@gmail.com");
console.log("Admin role applied.");
