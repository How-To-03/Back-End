const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {sortBy} = require("lodash");
const dbhelper = require("../db");
const db = require("../../database/db-config");
const table = "posts";

router.get("/", async (req, res, next) => {
    try {
        // Get username from token
        // Get user-id from username
        const username = req.token.username;
        const userId = await db("users").where("username", username)
                            .select("id")
                            .first();

        // Get all posts from db
        let posts = await db(table)
                            .join("users", "users.id", "posts.user_id")
                            .select("posts.id", "users.username", "posts.content", "posts.image");

        // Get users likes
        // (very hacky but works for now; should really be one sql search)
        const usersLikes = await db("post_likes")
                                .join("users", "users.id", "post_likes.user_id")
                                .where("users.id", userId.id)
                                .select("post_likes.post_id as id");

        // Determine if current user has liked each post
        posts = await Promise.all(posts.map(async (item, array) => {

            // Fetch all post likes
            let postLikes = await db("post_likes")
                                    .where("post_id", item.id)
                                    .count({ total: 'post_id' })
                                    .first();
            item.likes = postLikes["total"];

            if (usersLikes.some(likes => likes.id === item.id)) {
                item.hasLiked = true;
            }
            else {
                item.hasLiked = false;
            }
            return item;
        }));

        // Sort posts by likes (desc order; top-bottom)
        posts = sortBy(posts, [(o) => o.likes]).reverse();

        // Return all posts
        res.send(posts);
    } catch (err) {
        next(err);
    }
});

// Toggle post like for user
router.get("/:id/like", async (req, res, next) => {
    try {
        let postLikeState;
        // Get username from token
        // Get user-id from username
        const username = req.token.username;
        const userId = await db("users").where("username", username)
                            .select("id")
                            .first();

        // Get users likes
        // (very hacky but works for now; should really be one sql search)
        const usersLikes = await db("post_likes")
                                .join("users", "users.id", "post_likes.user_id")
                                .where("users.id", userId.id)
                                .select("post_likes.post_id as id");

        // Determine if current user has liked each post
        if (usersLikes.some(likes => likes.id == req.params.id)) {
            // Un-like post
            postLikeState = false;
            await db("post_likes")
                .where("post_id", req.params.id)
                .andWhere("user_id", userId.id)
                .first()
                .del();
        }
        else {
            // Like post
            postLikeState = true;
            await db("post_likes").insert({
                user_id: userId.id,
                post_id: req.params.id
            });
        }

        // Return new post-like state
        res.send({ "hasLiked": postLikeState });
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
        const username = req.token.username;

        // Update post to db
        await db(table).where("id", req.params.id).first().update({
            content: req.body.content,
            image: req.body.image || originalPost.image,
        });

        // Get full post from db
        const post = await db(table)
                            .where("posts.id", req.params.id).first()
                            .join("users", "users.id", "posts.user_id")
                            .orderBy("posts.likes", "desc")
                            .select("posts.id", "users.username", "posts.content", "posts.image", "posts.likes");

        // Return all posts
        res.send(post);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        // Get post before deleting
        const post = await db(table)
                            .where("posts.id", req.params.id).first()
                            .join("users", "users.id", "posts.user_id")
                            .orderBy("posts.likes", "desc")
                            .select("posts.id", "users.username", "posts.content", "posts.image", "posts.likes");

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
