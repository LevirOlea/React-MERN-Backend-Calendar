const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {
  // x-token en headers
  const token = req.header("x-token");

  if (!token)
    return res.status(401).json({
      message: "No hay token en la petición",
    });
    
  try {
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    console.log(payload);
    
    //* mandamos el id y el nombre del usuarioen la request para poder utilizarlo en nuestra aplicación
    req.uid = payload.uid;
    req.name = payload.name;
    
    next(); // continúa con la ejecución del middleware

  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Token no válido",
    });
  }

};

module.exports = {
  validarJWT,
};
