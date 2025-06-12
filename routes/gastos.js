// routes/expense.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Expense = require("../models/Gastos");
require("dotenv").config();

// Middleware de JWT
function verifyToken(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "No hay token, autorización denegada" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido" });
  }
}

// GET /api/gastos
router.get("/", verifyToken, async (req, res) => {
  try {
    const gastos = await Expense.find({ user: req.userId }).sort({ fecha: -1 });
    return res.json(gastos);
  } catch (err) {
    console.error("Error al obtener gastos:", err);
    return res.status(500).json({ msg: "Error interno del servidor" });
  }
});

// POST /api/gastos
router.post("/", verifyToken, async (req, res) => {
  const { descripcion, tipo, monto, fecha } = req.body;
  if (!descripcion || !tipo || monto === undefined || isNaN(monto)) {
    return res.status(400).json({ msg: "Descripción, tipo y monto son obligatorios" });
  }
  if (!["gasto importacion", "gasto vario", "gastos recurrentes"].includes(tipo)) {
    return res.status(400).json({ msg: "Tipo de gasto no válido" });
  }
  try {
    const nuevoGasto = new Expense({
      user: req.userId,
      descripcion,
      tipo,
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

// DELETE /api/gastos/:id
router.delete("/:id", verifyToken, async (req, res) => {
  const gastoId = req.params.id;
  try {
    const gasto = await Expense.findById(gastoId);
    if (!gasto) return res.status(404).json({ msg: "Gasto no encontrado" });
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

// PUT /api/gastos/:id
router.put("/:id", verifyToken, async (req, res) => {
  const gastoId = req.params.id;
  const { descripcion, tipo, monto, fecha } = req.body;
  try {
    const gasto = await Expense.findById(gastoId);
    if (!gasto) return res.status(404).json({ msg: "Gasto no encontrado" });
    if (gasto.user.toString() !== req.userId) {
      return res.status(401).json({ msg: "No autorizado para actualizar este gasto" });
    }
    if (descripcion !== undefined) gasto.descripcion = descripcion;
    if (tipo !== undefined) {
      if (!["gasto importacion", "gasto vario", "gastos recurrentes"].includes(tipo)) {
        return res.status(400).json({ msg: "Tipo de gasto no válido" });
      }
      gasto.tipo = tipo;
    }
    if (monto !== undefined) {
      if (isNaN(monto)) return res.status(400).json({ msg: "El monto debe ser un número válido" });
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
