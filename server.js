require("dotenv").config(); //For using env
const express = require("express");
const app = express();
const router = require("./router/auth-router");
const connectDb = require("./utils/db");
constconnectDb = require("./utils/db");

// Middleware to parse JSON request bodies
app.use(express.json());
//Routing
app.use("/api/auth", router);

// app.get("/", (req, res)=>{
//     res.status(200).send("Hey");
// })

const port = 8080;

connectDb().then(() => {
  app.listen(port, () => {
    console.log("Port 8080");
  });
});
