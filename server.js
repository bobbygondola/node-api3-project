const express = require('express');
const server = express();
const morgan = require("morgan");
const userRouter = require("./users/userRouter")
const postRouter = require("./posts/postRouter")
const db = require("./users/userDb")

//middleware
server.use(express.json());//built in middleware
server.use(morgan("combined"));
server.use(logger);
server.use("/users", userRouter)
server.use("/api/posts", postRouter)

//customMiddleWare
function logger(req, res, next) {
  console.log(`DATE---[${new Date().toISOString()}]|| REQUEST METHOD--- ${req.method}|| REQUEST URL--- ${req.url}|| FROM--- ${req.get('Origin')}||`)
  next()
}


server.get('/', (req, res) => {
  res.status(200).json({ enviorment: process.env.NODE_ENV, port: process.env.PORT });
});



module.exports = server;
