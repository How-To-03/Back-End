exports.up = function (knex) {
    return knex.schema.createTable("posts", (table) => {
        table.increments();
        table
            .integer("user_id")
            .unsigned()
            .notNullable()
            .references("users.id")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

        table.text("post_title").notNullable();
        table.text("post_body").notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("posts");
};
