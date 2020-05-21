const express = require("express");
const cors = require("cors");

// const authenticate = require("./auth/authenticate-middleware.js");
const authRouter = require("./auth/auth-router.js");

const server = express();

server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);

// Base root welcome message
server.get("/", (req, res) => {
    res.send({
        message: "Hello World!",
        routes: ["/api/auth/register", "/api/auth/login"],
    });
});

// Fallback server error message
server.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        message: "somthing went wrong",
        success: false
    });
});

module.exports = server;
