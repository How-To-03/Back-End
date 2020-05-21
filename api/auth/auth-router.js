const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

router.post("/register", async (req, res, next) => {
    // Get user info
    const user = req.body;

    // Hash user's password
    user.password = bcrypt.hashSync(user.password, 12);

    try {
        // Add user to db
        const [userId] = await db.insert(user);

        // Return username of user
        res.send({ username: user.username, success: true });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
