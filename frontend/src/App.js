import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Home from "./Home";
import Calculator from "./Calculadora";
import Compras from "./Compras";
import Gastos from "./Gastos";

import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {

      const res = await axios.post(`https://macso.onrender.com/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/home"); // Redirigir a la página principal
    } catch (err) {
      setMensaje("Error: " + err.response.data.msg);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://macso.onrender.com/api/auth/register`, { name, email, password });
      localStorage.setItem("token", res.data.token);
      setMensaje("Usuario creado correctamente! Ahora inicia sesión.");
      setIsRegistering(false);
    } catch (err) {
      console.error("❌ Error en registro:", err);
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        setMensaje("Error: " + err.response.data.errors[0].msg);
      } else if (err.response?.data?.msg) {
        setMensaje("Error: " + err.response.data.msg);
      } else {
        setMensaje("Error desconocido. Intenta de nuevo.");
      }
    }
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center">{isRegistering ? "Registro" : "Iniciar Sesión"}</h2>

        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
          {isRegistering && (
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isRegistering ? "Registrarse" : "Ingresar"}
          </button>
        </form>

        <div className="text-center mt-3">
          <button className="btn btn-link" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
          </button>
        </div>

        {mensaje && <div className="alert alert-info text-center mt-3">{mensaje}</div>}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/calculadora" element={<PrivateRoute><Calculator /></PrivateRoute>} />
        <Route path="/compras" element={<PrivateRoute><Compras /></PrivateRoute>} />
        <Route path="/gastos" element={<PrivateRoute><Gastos /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
}

// Protege la ruta de /home para que solo usuarios autenticados puedan acceder
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default App;
