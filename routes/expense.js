// Proyecto/routes/expense.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Expense = require("../models/Expense");
require("dotenv").config();

// Middleware para verificar JWT y extraer userId
function verifyToken(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) {
    return res.status(401).json({ msg: "No hay token, autorización denegada" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // asumimos que en el payload guardaste { id: user._id }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido" });
  }
}

// ------------------------------------------------------
// 1) GET /api/gastos
//    Devuelve todos los gastos del usuario autenticado
// ------------------------------------------------------
router.get("/", verifyToken, async (req, res) => {
  try {
    const gastos = await Expense.find({ user: req.userId }).sort({ fecha: -1 });
    return res.json(gastos);
  } catch (err) {
    console.error("Error al obtener gastos:", err);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
});

// ------------------------------------------------------
// 2) POST /api/gastos
//    Crea un nuevo gasto. Body: { descripcion, monto, [fecha] }
// ------------------------------------------------------
router.post("/", verifyToken, async (req, res) => {
  const { descripcion, monto, fecha } = req.body;
  // Validar que existan descripcion y que monto sea un número válido (incluso si es 0)
  if (!descripcion || monto === undefined || isNaN(monto)) {
    return res
      .status(400)
      .json({ msg: "Los campos descripción y monto son obligatorios" });
  }
  try {
    const nuevoGasto = new Expense({
      user: req.userId,
      descripcion,
      monto,
      fecha: fecha ? fecha : Date.now()
    });
    const gastoGuardado = await nuevoGasto.save();
    return res.json(gastoGuardado);
  } catch (err) {
    console.error("Error al crear gasto:", err);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
});

// ------------------------------------------------------
// 3) DELETE /api/gastos/:id
//    Elimina un gasto solo si pertenece al usuario autenticado
// ------------------------------------------------------
router.delete("/:id", verifyToken, async (req, res) => {
  const gastoId = req.params.id;
  try {
    const gasto = await Expense.findById(gastoId);
    if (!gasto) {
      return res.status(404).json({ msg: "Gasto no encontrado" });
    }
    if (gasto.user.toString() !== req.userId) {
      return res.status(401).json({ msg: "No autorizado para eliminar este gasto" });
    }
    await Expense.findByIdAndDelete(gastoId);
    return res.json({ ok: true, msg: "Gasto eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar gasto:", err);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
});

// ------------------------------------------------------
// 4) PUT /api/gastos/:id
//    Actualiza un gasto. Body: { descripcion?, monto?, fecha? }
// ------------------------------------------------------
router.put("/:id", verifyToken, async (req, res) => {
  const gastoId = req.params.id;
  const { descripcion, monto, fecha } = req.body;
  try {
    const gasto = await Expense.findById(gastoId);
    if (!gasto) {
      return res.status(404).json({ msg: "Gasto no encontrado" });
    }
    if (gasto.user.toString() !== req.userId) {
      return res.status(401).json({ msg: "No autorizado para actualizar este gasto" });
    }
    // Solo actualizar los campos que vengan definidos
    if (descripcion !== undefined) gasto.descripcion = descripcion;
    if (monto !== undefined) {
      if (isNaN(monto)) {
        return res.status(400).json({ msg: "El monto debe ser un número válido" });
      }
      gasto.monto = monto;
    }
    if (fecha !== undefined) gasto.fecha = fecha;

    const gastoActualizado = await gasto.save();
    return res.json(gastoActualizado);
  } catch (err) {
    console.error("Error al actualizar gasto:", err);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
});

module.exports = router;
