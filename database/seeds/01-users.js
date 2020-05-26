const bcrypt = require("bcryptjs");

exports.seed = function (knex) {
    return knex("users").insert([
        { id: 1, username: "test", password: bcrypt.hashSync("test", 6) }
    ]);
};
