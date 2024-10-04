const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email: email });
    console.log(usuario);

    if (usuario) {
      return res.status(400).json({
        ok: false,
        message: "El correo ya está registrado",
      });
    }

    usuario = new Usuario(req.body);

    // encriptar contraseña
    const salt = bcrypt.genSaltSync(10);
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();
    
    // generar jwt
    const token = await generarJWT( usuario.id, usuario.name );

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Por favor hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email: email });
    //   console.log(usuario);

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        message: "Usuario y contraseña no existe",
      });
    }

    // confirmar los password
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: "Contraseña no válida",
      });
    }
    
    // generar jwt
    const token = await generarJWT( usuario.id, usuario.name );

    // responder al usuario
    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      message: "Por favor hable con el administrador",
    });
  }
};

const revalidarToken = async (req, res = response) => {
    const {uid, name} = req;

    const token = await generarJWT( uid, name );

  res.json({
    ok: true,
    token
  });
};

module.exports = { crearUsuario, loginUsuario, revalidarToken };
