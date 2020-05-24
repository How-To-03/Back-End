const bcrypt = require("bcryptjs");

exports.seed = function (knex) {
    return knex("posts").insert([
        { id: 1, user_id: 1, content: "_INSERT AMAZING LIFE HACK_", image: "example.com/image.png" },
    ]);
};
