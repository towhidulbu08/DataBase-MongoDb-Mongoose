const express = require("express");
const mongoose = require("mongoose");
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");
const app = express();
app.use(express.json());

//database connection with mongoose
mongoose
  .connect("mongodb://localhost/todos")
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));
//application routes

app.use("/todo", todoHandler);
app.use("/user", userHandler);

//default error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};
app.use(errorHandler);

app.listen(3000, () => {
  console.log("App Listening at Port 3000");
});
