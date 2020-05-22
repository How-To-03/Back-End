exports.up = function (knex) {
    return knex.schema.createTable("post_attributes", (table) => {
        table.increments();
        table
            .integer("post_id")
            .unsigned()
            .notNullable()
            .references("posts.id")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");

        table.integer("likes").defaultTo(0);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("post_attributes");
};
