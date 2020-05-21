const bcrypt = require("bcryptjs");

exports.seed = function (knex) {
    return knex("users").insert([
        { id: 1, username: "John Doe", password: bcrypt.hashSync("pass", 6) },
        { id: 2, username: "test", password: bcrypt.hashSync("test", 6) },
    ]);
};
