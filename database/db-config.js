const { createPool } = require("mysql2/promise");

const conexion = createPool({
    host:'bq3olc0muulmm8qtdt0s-mysql.services.clever-cloud.com',
    user: 'u0nl2ngygohcbh7w',
    database: 'bq3olc0muulmm8qtdt0s',
    port: 3306,
    connectionLimit: 8,
    waitForConnections: true,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    password:'jGuFCRVGczsXi5wMMZOg'
});

module.exports = conexion