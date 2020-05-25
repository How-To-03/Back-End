const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dbhelper = require("../db");
const db = require("../../database/db-config");
const table = "posts";

router.get("/", async (req, res, next) => {
    try {
        // Get all posts from db
        const posts = await db(table).join("users", "users.id", "posts.user_id")
                            .orderBy("posts.likes", "desc")
                            .select("posts.id", "users.username", "posts.content", "posts.image", "posts.likes");

        // Return all posts
        res.send(posts);
    } catch (err) {
        next(err);
    }
});

// Validate required post data
function validateBody() {
    return (req, res, next) => {
        // Check request body exists
        if (req.body) {
            // Check required post data exists
            if (req.body.content) {
                return next();
            }
        }

        // No data sent
        res.status(400).json({
            message: "missing post data",
            missingData: true,
            success: false,
        });
    };
}

module.exports = router;
