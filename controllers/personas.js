const { request, response } = require("express")
const conexion = require("../database/db-config")
const { emailExist, rutExist } = require("../helpers/db-validators")
const ChileanRutify = require('chilean-rutify');

const getPersonas = async(req=request, res=response) => {

    const query = 'SELECT * FROM persona'
    const [data] = await conexion.query(query)
        .catch((err) => {
            console.log(err);
        })

    if (data.length < 1) {
        return res.json({msg:'No existen usuarios en la base de datos'})
    }
    return res.json(data)
}


const getPersonaById = async(req=request, res=response) => {

    const id = req.params.id

    const query = "SELECT * FROM persona WHERE id_persona = ?;"

    try {
        const [data] = await conexion.execute(query, [id]) 
        
        if (data.length < 1) {
            return res.status(400).json({
                msg:'Error al encontrar a la persona'
            })    
        }

        return res.status(200).json(data[0])

    } catch (error) {
        return res.status(400).json({
            msg:'Error al encontrar a la persona'
        })     
    }
}

const getReferencias = async(req, res) => {
    
    const id = req.params.id

    const query = "SELECT * FROM Referencias WHERE persona_id = ? OR persona_referenciada_id = ?;"

    try {
        const [data] = await conexion.execute(query, [id, id]) 
        
        return res.status(200).json(data)

    } catch (error) {
        return res.status(400).json({
            msg:'Error al encontrar a la persona'
        })     
    }
} 


const postPersona = async(req=request, res=response) => {

    const { nombre, apellido, rut, sexo, telefono, direccion, 
        fec_nacimiento, email, id_comuna, id_referencia } = req.body

    const fecha = new Date(fec_nacimiento);    

    const query = `INSERT INTO persona (nombre, apellido, rut, sexo, telefono, direccion, fec_nacimiento, email, id_comuna)
    VALUES (?,?,?,?,?,?,?,?,?);`
    
    const emailValidator = await emailExist(email);
    const rutNormalizado = ChileanRutify.normalizeRut(rut)
    const rutValidator = await rutExist(rutNormalizado)
    
    if (rutValidator) {
        return res.status(400).json({msg: 'Rut ya registrado!'})    
    }

    if (emailValidator) {
        return res.status(400).json({msg: 'Correo ya registrado!'})
    }

    if (!ChileanRutify.validRut(rutNormalizado)) {
        return res.status(400).json({msg: 'Rut invalido!'})  
    }

    try {
        const [rows] = await conexion.execute(query, 
            [nombre, apellido, rutNormalizado, sexo, telefono, direccion, fecha, email, id_comuna]);

        
        if (id_referencia) {

            //Obtener id del usuario creado
            const [persona] = await conexion.query(`SELECT id_persona FROM persona WHERE rut = ${rutNormalizado}`) 
            console.log(persona[0].id_persona);

            //Obtener la referencia
            const [referencia] = await conexion.query(`SELECT id_persona FROM persona WHERE rut = ${id_referencia}`)

            // Insertar la referencia
            const [rows] = await conexion.execute("INSERT INTO Referencias (persona_id, persona_referenciada_id) VALUES (?,?);", 
            [persona[0].id_persona, referencia[0].id_persona] )

            console.log(rows);
        }
    
    } catch (error) {
        console.log(error);
        return res.status(400).json({msg: 'Error al crear el usuario'});
    }

    return res.status(200).json({
        msg:'Usuario creado con éxito',
    }) 
}

const putPersona = async(req=request, res=response) => {

    const {id_persona, nombre, apellido, sexo, telefono, direccion, 
        fec_nacimiento, id_comuna } = req.body

    const fecha = new Date(fec_nacimiento);    

    const query = `UPDATE persona SET nombre = ?, apellido = ?, 
    sexo = ?, telefono = ?, direccion = ?, fec_nacimiento = ?, id_comuna = ? WHERE id_persona = ?`;

    const values = [nombre, apellido, sexo, telefono, direccion, fecha, id_comuna, id_persona];

    try {
        const [rows, fields] = await conexion.execute(query, values);

        if (rows) {
            return res.json({
                msg:'Usuario actualizado con éxito'
            })    
        }
        
    } catch (error) {
        console.log(error);
        return res.json({msg: 'Error al actualizar el usuario'});  
    }
   
    
}



const deletePersona = async(req=request, res=response) => {

    const id_persona = req.params.id;

    if (!id_persona) {
        return res.json({
            msg: 'Error al eliminar a la persona, falta el id'
        })   
    }

    try {


        const queryReferencias = "DELETE FROM Referencias WHERE persona_id = ? OR persona_referenciada_id = ?;"
        const [filas] = await conexion.execute(queryReferencias, [id_persona, id_persona])

        const query = "DELETE FROM persona WHERE id_persona = ?;"
        const [rows] = await conexion.execute(query, [id_persona]) 

    } catch (error) {
        return res.json({
            msg:'Error al eliminar a la persona'
        })
    }

    
    return res.json({
        msg: 'Persona eliminada con éxito'
    })
}


const getRegiones = async(req=request, res=response) => {

    const query = "SELECT * FROM region"
    const [data] = await conexion.query(query)
        .catch(error => {
            return res.json({msg:'Ha ocurrido un error'})
        })
    return res.json(data)
    
}

const getComunas = async(req=request, res=response) => {

    const query = "SELECT * FROM comuna"
    const [data] = await conexion.query(query)
        .catch(error => {
            return res.json({msg:'Ha ocurrido un error'})
        })
    return res.json(data)
}


module.exports = {
    getPersonas,
    postPersona,
    putPersona,
    deletePersona,
    getRegiones,
    getComunas,
    getPersonaById,
    getReferencias
}