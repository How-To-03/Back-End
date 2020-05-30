exports.up = function (knex) {
    return knex.schema.createTable("post_likes", (table) => {
        table
            .integer("user_id")
            .unsigned()
            .notNullable()
            .references("users.id");

        table
            .integer("post_id")
            .unsigned()
            .notNullable()
            .references("posts.id");
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("post_likes");
};
