const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Registrar usuario
router.post(
  "/register",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Ingresa un email válido").isEmail(),
    check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "El usuario ya existe" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword });
      await user.save();

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token });
      console.log("📨 Recibido registro:", req.body);

    } catch (err) {
      console.error("❌ Error en /register:", err);
      res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
    }
  }
);

// Iniciar sesión
router.post(
  "/login",
  [
    check("email", "Ingresa un email válido").isEmail(),
    check("password", "La contraseña es obligatoria").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Credenciales incorrectas" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Credenciales incorrectas" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token });
    } catch (err) {
      console.error("❌ Error en /login:", err);
      res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
    }
  }
);

// Obtener datos del usuario autenticado
router.get("/user", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "No hay token, permiso denegado" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ msg: "Token inválido o expirado" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json(user);
  } catch (err) {
    console.error("❌ Error en /user:", err);
    res.status(500).json({ error: "Error interno del servidor", detalle: err.message });
  }
});

module.exports = router;
