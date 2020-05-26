const express = require("express");
const cors = require("cors");

const authenticate = require("./auth/authenticate-middleware.js");
const authRouter = require("./auth/auth-router.js");
const postsRouter = require("./posts/posts-router.js");

const server = express();

server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/posts", authenticate, postsRouter);

// Base root welcome message
server.get("/", (req, res) => {
    res.send({
        message: "Hello World!",
        routes: ["/api/auth/register", "/api/auth/login", "/api/posts"],
    });
});

// Fallback server error message
server.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        message: "somthing went wrong",
        success: false,
    });
});

module.exports = server;
