const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");

require("dotenv").config();

const app = express();

app.listen(8000, () => {
  console.log("Server is running on port 3000");
});
