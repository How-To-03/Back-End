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

        table.text("content").notNullable();
        table.text("image");
        table.integer("likes").defaultTo(0);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("posts");
};
