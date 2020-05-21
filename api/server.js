const express = require("express");
const cors = require("cors");

const server = express();

server.use(cors());
server.use(express.json());

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
        message: "Somthing went wrong",
    });
});

module.exports = server;
