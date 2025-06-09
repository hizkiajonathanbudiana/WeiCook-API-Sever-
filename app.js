const express = require("express");
const app = express();
const router = require("./routers/router");
const port = 3000;

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(router);

app.listen(port, () => {
  console.log("listening on port", port);
});
