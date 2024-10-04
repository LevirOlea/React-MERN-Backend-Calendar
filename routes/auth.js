/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const {Router} = require('express');
const { check } = require('express-validator')
const { loginUsuario, crearUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-token');
const router = Router();


router.post(
    '/new', 
    [ // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ] , 
    crearUsuario
)

router.post(
    '/', 
    [ // middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ] , 
    loginUsuario
)

router.get('/renew', validarJWT, revalidarToken)

module.exports = router;