const express = require('express');
const cors = require('cors');


class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        

        this.paths = {
            personas:   '/api/personas',
        }

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

    }

    routes() {
        this.app.use(this.paths.personas, require('../routes/personas'))       
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}

module.exports = Server;
