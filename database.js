const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      .then(() => console.log("DB connection successful! ✅✅ "))
      .catch((err) => {
        console.log("⚠️ --  Database Connection Error 💥💥 -- ⚠️  " + err);
        process.exit(1);
      });
  }
}

module.exports = new Database();
