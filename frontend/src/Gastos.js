// Proyecto/frontend/src/Gastos.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Gastos() {
  const [gastos, setGastos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");

  // Tomamos el token JWT de localStorage
  const token = localStorage.getItem("token") || "";

  // Configuración de headers: incluimos x-auth-token
  const config = {
    headers: {
      "x-auth-token": token,
      "Content-Type": "application/json"
    }
  };

  // URL de producción
  const BASE_API = "https://macso.onrender.com/api";

  // 1) Obtener todos los gastos del usuario (GET /api/gastos)
  const fetchGastos = async () => {
    if (!token) return; // si no hay token, no hacemos nada
    try {
      const res = await axios.get(`${BASE_API}/gastos`, config);
      setGastos(res.data);
    } catch (error) {
      console.error("Error al obtener gastos:", (error.response || error).data || error.message);
    }
  };

  // 2) Crear un nuevo gasto (POST /api/gastos)
  const crearGasto = async (payload) => {
    try {
      await axios.post(`${BASE_API}/gastos`, payload, config);
      fetchGastos();
    } catch (error) {
      console.error("Error al crear gasto:", (error.response || error).data || error.message);
      alert("No se pudo crear el gasto. Revisa la consola para más detalles.");
    }
  };

  // 3) Eliminar un gasto por ID (DELETE /api/gastos/:id)
  const eliminarGasto = async (id) => {
    try {
      await axios.delete(`${BASE_API}/gastos/${id}`, config);
      fetchGastos();
    } catch (error) {
      console.error("Error al eliminar gasto:", (error.response || error).data || error.message);
      alert("No se pudo eliminar el gasto. Revisa la consola para más detalles.");
    }
  };

  // Al montar el componente, cargamos la lista de gastos
  useEffect(() => {
    fetchGastos();
  }, []);

  // Al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!descripcion || monto === "") {
      alert("La descripción y el monto son obligatorios.");
      return;
    }
    const parsedMonto = parseFloat(monto);
    const payload = {
      descripcion,
      monto: parsedMonto,
      fecha: fecha || undefined
    };
    crearGasto(payload);
    setDescripcion("");
    setMonto("");
    setFecha("");
  };

  // Formatear fecha ISO a local
  const formatFecha = (isoString) => {
    const fechaObj = new Date(isoString);
    return fechaObj.toLocaleDateString();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Gastos</h2>

      {/* Botón para volver a la página principal */}
      <a href="/" className="btn btn-primary mb-4">
        ← Volver al inicio
      </a>

      {/* Formulario para crear un gasto nuevo */}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              className="form-control"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej. Compra de mercado"
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Monto (S/)</label>
            <input
              type="number"
              className="form-control"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className="col-md-2 mb-3 d-flex align-items-end">
            <button type="submit" className="btn btn-success w-100">
              Agregar
            </button>
          </div>
        </div>
      </form>

      <hr />

      {/* Lista de gastos */}
      <h5>Lista de Gastos</h5>
      {gastos.length === 0 ? (
        <p className="text-muted">No hay gastos registrados.</p>
      ) : (
        <ul className="list-group">
          {gastos.map((gasto) => (
            <li
              key={gasto._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{gasto.descripcion}</strong> — S/ {gasto.monto.toFixed(2)} <br />
                <small className="text-muted">{formatFecha(gasto.fecha)}</small>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  if (window.confirm("¿Estás seguro de eliminar este gasto?")) {
                    eliminarGasto(gasto._id);
                  }
                }}
                title="Eliminar gasto"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Gastos;
