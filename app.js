const database = require("./database");
const port = 3000;
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const app = express();

const errorController = require("./controllers/errorController");
const User = require("./models/userModel");

// Routes Initialization
const adminRoutes = require("./routes/adminRoutes");
const shopRoutes = require("./routes/shopRoutes");
const authRoutes = require("./routes/authRoutes");

const MONGODB_URI = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

const server = app.listen(port, () => {
  console.log("Server listening on port " + port);
});

// Handling port in use error
server.once("error", function (err) {
  if (err.code === "EADDRINUSE") {
    app.listen(8000, () =>
      console.log("Server listening on the 2nd port " + 8000)
    );
  }
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "IloveMyParentsHannouchFromEdBELMYDADISMEHSENHOHOH",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  (res.locals.isAuthenticated = req.session.isLoggedIn),
    (res.locals.csrfToken = req.csrfToken()),
    (res.locals.isAdmin = req.session.isAdmin);
  if (req.session.isLoggedIn) {
    res.locals.currentUserId = req.user._id;
  }

  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
