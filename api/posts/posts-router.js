const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

router.get("/", async (req, res, next) => {
    try {
        // Get all posts from db
        const posts = await db.getAll("posts");

        // Return username of user
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
            if (req.body.post_title && req.body.post_body) {
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
