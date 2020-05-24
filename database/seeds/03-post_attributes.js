const bcrypt = require("bcryptjs");

exports.seed = function (knex) {
    return knex("post_attributes").insert([{ id: 1, post_id: 1, likes: 8 }]);
};
