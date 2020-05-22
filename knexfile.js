module.exports = {
    client: "sqlite3",
    connection: { filename: "./database/howto.db3" },
    useNullAsDefault: true,
    migrations: {
        directory: "./database/migrations",
        tableName: "dbmigrations",
    },
    seeds: { directory: "./database/seeds" }
};
