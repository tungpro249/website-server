require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;

// connect database
const db = require("./config/db");
db.connect();

app.use(cookieParser());

// morgan HTTP request
app.use(morgan("combined"));

app.use(express.json());

app.use("/user", require("./routes/users"));
app.use("/api", require("./routes/products"))

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
