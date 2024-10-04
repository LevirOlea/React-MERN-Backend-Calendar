const { response } = require("express");
const Evento = require("../models/Evento.js");

const obtenerEventos = async (req, res = response) => {
  const eventos = await Evento.find().populate("user", "name");

  res.status(200).json({
    ok: true,
    eventos,
  });
};

const crearEvento = async (req, res = response) => {
  //verificar que tenga el evento
  const evento = new Evento(req.body);

  try {
    evento.user = req.uid;
    const eventoSaved = await evento.save();

    res.json({
      ok: true,
      evento: eventoSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Error al crear el evento, hable con el administrador",
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  const { id } = req.params;

  try {
    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        message: "El evento no existe",
      });
    }
    if (evento.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        message: "No tiene permisos para actualizar este evento",
      });
    }
    const nuevoEvento = {
      ...req.body,
      user: req.uid,
    };

    const eventoUpdated = await Evento.findByIdAndUpdate(id, nuevoEvento, {
      new: true,
    });

    res.json({
      ok: true,
      evento: eventoUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Error al actualizar el evento, hable con el administrador",
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const { id } = req.params;

  try {
    const evento = await Evento.findById(id);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        message: "El evento no existe",
      });
    }
    if (evento.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        message: "No tiene permisos para eliminar este evento",
      });
    }
    await Evento.findByIdAndDelete(id);
    res.json({
      ok: true,
      message: "El evento ha sido eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: "Error al eliminar el evento, hable con el administrador",
    });
  }
};

module.exports = {
  obtenerEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
