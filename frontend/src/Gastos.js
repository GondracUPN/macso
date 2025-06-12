// src/Gastos.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Gastos() {
  const [gastos, setGastos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("gasto importacion");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(() => {
    // Inicializar con la fecha de hoy en formato YYYY-MM-DD
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  });

  const token = localStorage.getItem("token") || "";
  const config = {
    headers: {
      "x-auth-token": token,
      "Content-Type": "application/json",
    },
  };
  const BASE_API = "https://macso.onrender.com/api";

  // Fetch
  const fetchGastos = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BASE_API}/gastos`, config);
      setGastos(res.data);
    } catch (error) {
      console.error("Error al obtener gastos:", error.response?.data || error.message);
    }
  };

  // Crear
  const crearGasto = async (payload) => {
    try {
      await axios.post(`${BASE_API}/gastos`, payload, config);
      fetchGastos();
    } catch (error) {
      console.error("Error al crear gasto:", error.response?.data || error.message);
      alert("No se pudo crear el gasto. Revisa la consola.");
    }
  };

  // Eliminar
  const eliminarGasto = async (id) => {
    try {
      await axios.delete(`${BASE_API}/gastos/${id}`, config);
      fetchGastos();
    } catch (error) {
      console.error("Error al eliminar gasto:", error.response?.data || error.message);
      alert("No se pudo eliminar el gasto. Revisa la consola.");
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!descripcion || monto === "" || !tipo) {
      alert("Descripción, tipo y monto son obligatorios.");
      return;
    }
    const parsedMonto = parseFloat(monto);
    const payload = {
      descripcion,
      tipo,
      monto: parsedMonto,
      fecha,
    };
    crearGasto(payload);
    setDescripcion("");
    setTipo("gasto importacion");
    setMonto("");
    // volver a hoy:
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    setFecha(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`);
  };

  const formatFecha = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString();
  };

  // Agrupar por tipo
  const tipos = ["gasto importacion", "gasto vario", "gastos recurrentes"];
  const gastosByType = tipos.reduce((acc, t) => {
    acc[t] = gastos.filter((g) => g.tipo === t);
    return acc;
  }, {});
  const maxLen = Math.max(...Object.values(gastosByType).map((arr) => arr.length));

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Gastos</h2>
      <a href="/" className="btn btn-primary mb-4">← Volver al inicio</a>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Descripción */}
          <div className="col-md-3 mb-3">
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

          {/* Tipo */}
          <div className="col-md-3 mb-3">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="gasto importacion">Gasto importación</option>
              <option value="gasto vario">Gasto vario</option>
              <option value="gastos recurrentes">Gastos recurrentes</option>
            </select>
          </div>

          {/* Monto */}
          <div className="col-md-2 mb-3">
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

          {/* Fecha */}
          <div className="col-md-2 mb-3">
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

      {/* Tabla agrupada por tipo */}
      <h5>Lista de Gastos por Tipo</h5>
      {gastos.length === 0 ? (
        <p className="text-muted">No hay gastos registrados.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Gasto importación</th>
              <th>Gasto vario</th>
              <th>Gastos recurrentes</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxLen }).map((_, i) => (
              <tr key={i}>
                {tipos.map((t) => {
                  const item = gastosByType[t][i];
                  return (
                    <td key={t}>
                      {item ? (
                        <>
                          <strong>{item.descripcion}</strong> — S/ {item.monto.toFixed(2)}<br/>
                          <small className="text-muted">{formatFecha(item.fecha)}</small><br/>
                          <button
                            className="btn btn-sm btn-danger mt-1"
                            onClick={() => {
                              if (window.confirm("¿Eliminar este gasto?")) eliminarGasto(item._id);
                            }}
                          >
                            ×
                          </button>
                        </>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Gastos;
