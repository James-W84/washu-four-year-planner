const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");
const users = require("./routes/api/users");
const classes = require("./routes/api/classes");

//gets express to use body parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

//Set up a connection to the Mongo database
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successful Connection"))
  .catch((err) => console.log(err));
//passport middleware
app.use(passport.initialize());
//passport config
require("./config/passport")(passport);
//Routes
app.use("/api/users", users);
app.use("/api/classes", classes);

// we can use process.env.port for Heroku
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
