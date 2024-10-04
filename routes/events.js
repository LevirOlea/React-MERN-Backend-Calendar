/*
    Event Routes
    localhost:4000/api/events
*/

const { Router } = require("express");
const { check } = require("express-validator")

const { validarCampos } = require('../middlewares/validarCampos.js')
const { validarJWT } = require("../middlewares/validar-token");
const router = Router();

const {
  obtenerEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require("../controllers/events.js");
const { isDate } = require("../helpers/isDate.js");

// Todas tienen que pasar por la validación del JWT
// * A partir de este router hacia abajo todos van a pasar por este middleware
router.use( validarJWT );

// Obtener eventos
router.get("/", obtenerEventos);

//Crear Evento
router.post(
  "/", 
  [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatorio').custom( isDate ),
    check('end', 'Fecha de finalización es obligatorio').custom( isDate ),
    check('notes', 'Notas es obligatorio').not().isEmpty(),
    validarCampos
  ],
  crearEvento
);

//Actualizar Evento
router.put("/:id", actualizarEvento);

//Borrar Evento
router.delete("/:id", eliminarEvento);

module.exports = router;
