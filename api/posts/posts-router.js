const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {sortBy} = require("lodash");
const dbmodel = require("../db");
const db = require("../../database/db-config");
const table = "posts";

router.get("/", getUser(), async (req, res, next) => {
    try {
        // Get all posts from db
        let posts = await dbmodel.getAllPosts();

        // Determine if current user has liked each post
        posts = await Promise.all(posts.map(async (item, array) => {
            return dbmodel.determinePostLikes(req.user.id, item);
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
router.get("/:id/like", getUser(), async (req, res, next) => {
    try {
        let postLikeState;

        // Get users likes
        const usersLikes = await dbmodel.getUsersLikes(req.user.id);

        // Determine if current user has liked each post
        if (usersLikes.some(likes => likes.id == req.params.id)) {
            // Un-like post
            postLikeState = false;
            await db("post_likes")
                .where("post_id", req.params.id)
                .andWhere("user_id", req.user.id)
                .first()
                .del();
        }
        else {
            // Like post
            postLikeState = true;
            await db("post_likes").insert({
                user_id: req.user.id,
                post_id: req.params.id
            });
        }

        // Return new post-like state
        res.send({ "hasLiked": postLikeState });
    } catch (err) {
        next(err);
    }
});

router.post("/", validateBody(), getUser(), async (req, res, next) => {
    try {
        const post = {
            content: req.body.content,
            image: req.body.image || null
        }

        // Add post to db
        const [postId] = await db(table).insert({
            user_id: req.user.id,
            ...post
        });

        // Return new post
        res.send({
            id: postId,
            username: req.username,
            ...post
        });
    } catch (err) {
        next(err);
    }
});


router.put("/:id", validateBody(), getUser(), async (req, res, next) => {
    try {
        // Get post before updating
        const postOriginal = await dbmodel.getPost(req.params.id);

        //  Check if post exists
        if (!postOriginal) {
            // Post does not exist
            res.status(400).json({
                message: "requested post does not exist /posts/:id",
                missingData: true,
                success: false,
            });
        }

        // Update post to db
        await db(table).where("id", req.params.id).first().update({
            content: req.body.content,
            image: req.body.image || postOriginal.image,
        });

        // Get full post from db
        const postUpdated = await dbmodel.getPost(req.params.id);

        // Return updated post
        res.send(postUpdated);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        // Get post before deleting
        const post = await dbmodel.getPost(req.params.id);

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

        // Return deleted post
        res.send(post);
    } catch (err) {
        next(err);
    }
});


//------------------------------------------------------------------------------
// Router middleware

// Get full user-object from database
function getUser() {
    return (req, res, next) => {
        req.username = req.token.username;

        // Get user from database
        db("users").where("username", req.username).first()
            .then((user) => {
                // Add user object to request
                req.user = user;
                next();
            })
            .catch((error) => {
                console.log("getUser failed:", error);

                res.status(500).json({
                    message: "unable to find user data",
                    success: false,
                });
            });
    }
}

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
