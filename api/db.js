const db = require("../database/db-config");

function getAll(table) {
    return db(table);
}

function get(table, col, value) {
    return db(table).where(col, value);
}

function insert(table, obj) {
    return db(table).insert(obj);
}

module.exports = { getAll, get, insert };
