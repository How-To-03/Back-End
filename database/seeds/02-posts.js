exports.seed = function (knex) {
    return knex("posts").insert([
        { id: 1, user_id: 1, content: "_INSERT AMAZING LIFE HACK_", image: "https://res.cloudinary.com/dicdxigq4/image/upload/v1590538257/sample.jpg", likes: 8 },
        { id: 2, user_id: 1, content: "_ANOTHER AMAZING LIFE HACK_", image: "https://res.cloudinary.com/dicdxigq4/image/upload/v1590538257/sample.jpg", likes: 21 },
    ]);
};
