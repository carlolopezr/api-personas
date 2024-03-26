const { createPool } = require("mysql2/promise");

const conexion = createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    connectionLimit: 8,
    waitForConnections: true,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    password:process.env.PASSWORD
});

module.exports = conexion