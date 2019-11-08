const { Pool } = require('pg');
const config = require('../../config');
const pool = new Pool({
    user: config.db_user,
    host: config.db_host,
    database: config.db_schema,
    password: config.db_password,
    port: config.db_port,
});
module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    },
};