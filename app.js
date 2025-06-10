const express = require("express");
const app = express();
const router = require("./routers/router");
const port = 3000;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(router);

app.use((error, req, res, next) => {
  let code = 500;
  let msg = "Internal Server Error";

  console.log(error);

  if (error.message === "USER_CREATE_FAILED") {
    code = 400;
    msg = "Bad Request";
  } else if (error.message === "INVALID_USERNAME_OR_PASSWORD") {
    code = 400;
    msg = "Invalid email / password";
  } else if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    const err = error.errors.map((el) => el.message);
    code = 400;
    msg = err;
  }

  res.status(code).json({ error: msg });
});
app.listen(port, () => {
  console.log("listening on port", port);
});
