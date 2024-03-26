const conexion = require("../database/db-config");


const emailExist = async(email) => {

    const query = `SELECT * FROM persona WHERE email = ?`
    const [data] = await conexion.execute(query, [email])


    if (data.length >= 1) {
        return true
    }

    return false
}


const rutExist = async(rut) => {

    const query = `SELECT * FROM persona WHERE rut = ?`
    const [data] = await conexion.execute(query, [rut])

    if (data.length >= 1) {
        return true
    }

    return false
}


module.exports = {
    emailExist,
    rutExist
}