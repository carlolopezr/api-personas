const { Router } = require("express");
const { getPersonas, postPersona, putPersona, 
    deletePersona, getRegiones, getComunas, getPersonaById, getReferencias } = require("../controllers/personas");

const { validator } = require("../middlewares/validator-middleware");
const { body, check } = require("express-validator");

const router = Router();


router.get('/', getPersonas)

router.get('/regiones', getRegiones)

router.get('/comunas', getComunas)

router.get('/persona/:id', [
    check('id', 'Falta el id en la solicitud').notEmpty(),
    validator
],  getPersonaById)

router.get('/referencias/:id',[
    check('id', 'Falta el id en la solicitud').notEmpty(),
    validator
] ,getReferencias)

router.post('/post-persona', [
    body('nombre', 'El nombre no puede estar vacio').notEmpty(),
    body('apellido', 'El apellido no puede estar vacio').notEmpty(),
    body('rut', 'El rut no puede estar vacio').notEmpty(),
    body('direccion', 'la direccion no puede estar vacio').notEmpty(),
    body('sexo', 'El sexo no puede estar vacio').notEmpty(),
    body('telefono', 'El telefono no puede estar vacio').notEmpty(),
    validator
], postPersona)

router.put('/put-persona', [
    body('id_persona', 'Falta el id de la persona').notEmpty(),
    body('nombre', 'El nombre no puede estar vacio').notEmpty(),
    body('apellido', 'El apellido no puede estar vacio').notEmpty(),
    body('direccion', 'la direccion no puede estar vacio').notEmpty(),
    body('sexo', 'El sexo no puede estar vacio').notEmpty(),
    body('telefono', 'El telefono no puede estar vacio').notEmpty(),
    validator
], putPersona)

router.delete('/delete-persona/:id', [
    check('id', 'Falta el id de la persona').notEmpty(),
    validator   
], deletePersona)

module.exports = router