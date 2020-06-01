const db = require("../database/db-config");

function getAll(table) {
    return db(table);
}

function get(table, col, value) {
    return db(table).where(col, value);
}

function insert(table, obj) {
    return db(table).insert(obj);
}


//------------------------------------------------------------------------------


// Get all posts
async function getAllPosts() {
    try {
        return await db("posts")
                        .join("users", "users.id", "posts.user_id")
                        .select("posts.id", "users.username", "posts.content", "posts.image");
    } catch (err) {
        next(err);
    }
}

// Get an individual post by it's ID
async function getPost(postId) {
    try {
        return await db("posts")
                        .where("posts.id", postId).first()
                        .join("users", "users.id", "posts.user_id")
                        .select("posts.id", "users.username", "posts.content", "posts.image");
    } catch (err) {
        next(err);
    }
}

// Get all users likes
async function getUsersLikes(userId) {
    try {
        return await db("post_likes")
                        .join("users", "users.id", "post_likes.user_id")
                        .where("users.id", userId)
                        .select("post_likes.post_id as id");
    } catch (err) {
        next(err);
    }
}

// Determine if current user has liked a post
// -> return post with hasLiked value
async function determinePostLikes(userId, post) {
    try {
        // All users likes
        const usersLikes = await getUsersLikes(userId);

        // Fetch all post likes
        let postLikes = await db("post_likes")
                                .where("post_id", post.id)
                                .count({ total: 'post_id' })
                                .first();
        post.likes = postLikes["total"];

        if (usersLikes.some(likes => likes.id === post.id)) {
            post.hasLiked = true;
        }
        else {
            post.hasLiked = false;
        }

        return post;
    } catch (err) {
        next(err);
    }
}


//------------------------------------------------------------------------------


module.exports = { getAll, get, insert, getPost, getAllPosts, getUsersLikes, determinePostLikes };
