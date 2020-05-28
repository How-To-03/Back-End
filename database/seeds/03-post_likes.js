exports.seed = function (knex) {
    return knex("post_likes").insert([
        { user_id: 1, post_id: 1 },
        { user_id: 2, post_id: 1 },
        { user_id: 2, post_id: 2 },
    ]);
};
