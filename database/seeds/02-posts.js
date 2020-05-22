const bcrypt = require("bcryptjs");

exports.seed = function (knex) {
    return knex("posts").insert([
        { id: 1, user_id: 1, title: "title", body: "body" }
    ]);
};
