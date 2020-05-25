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

router.post("/", validateBody(), async (req, res, next) => {
    try {
        // Get username from token
        // Get user-id from username
        const username = req.token.username;
        const userId = await db("users").where("username", username)
                            .select("id")
                            .first();

        const post = {
            content: req.body.content,
            image: req.body.image || null,
            likes: 0
        }

        // Add post to db
        const [postId] = await db(table).insert({
            user_id: userId.id,
            ...post
        });

        // Return all posts
        res.send({
            id: postId,
            username: username,
            ...post
        });
    } catch (err) {
        next(err);
    }
});


router.put("/:id", validateBody(), async (req, res, next) => {
    try {
        // Get post before updating
        const originalPost = await db(table).where("id", req.params.id).first();

        //  Check if post exists
        if (!originalPost) {
            // Post does not exist
            res.status(400).json({
                message: "requested post does not exist /posts/:id",
                missingData: true,
                success: false,
            });
        }

        // Get username from token
        // Get user-id from username
        const username = req.token.username;
        const userId = await db("users").where("username", username)
                            .select("id")
                            .first();

        const post = {
            content: req.body.content
        }

        // Add post to db
        const postId = await db(table).where("id", req.params.id).first().update({
            user_id: userId.id,
            ...post
        });

        console.log(postId);

        // Return all posts
        res.send({
            id: postId,
            username: username,
            ...post
        });
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        // Get post before deleting
        const post = await db(table).where("id", req.params.id).first();

        //  Check if post exists
        if (!post) {
            // Post does not exist
            res.status(400).json({
                message: "requested post does not exist /posts/:id",
                missingData: true,
                success: false,
            });
        }

        // Remove post from db
        await db(table).where("id", req.params.id).first().del();

        // Return all posts
        res.send(post);
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
