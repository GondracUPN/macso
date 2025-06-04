import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  const navigate = useNavigate();

  // Redirigir a la página de la calculadora
  const goToCalculator = () => {
    const button = document.getElementById("goToCalculatorBtn");
    button.classList.add("clicked");
    setTimeout(() => {
      button.classList.remove("clicked");
      navigate("/calculadora");
    }, 300);
  };

  // Redirigir a la página de Compras
  const goToCompras = () => {
    const button = document.getElementById("goToComprasBtn");
    button.classList.add("clicked");
    setTimeout(() => {
      button.classList.remove("clicked");
      navigate("/compras");
    }, 300);
  };
// Función para navegar a Gastos (Opción 3)
  const goToGastos = () => {
    const btn = document.getElementById("goToGastosBtn");
    btn.classList.add("clicked");
    setTimeout(() => {
      btn.classList.remove("clicked");
      navigate("/gastos");
    }, 300);
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Administración Macsomenos</h1>

      <div className="row">
        {/* Opción 1: Calculadora */}
        <div className="col-md-3">
          <div
            className="card p-4 shadow-sm"
            id="goToCalculatorBtn"
            onClick={goToCalculator}
            style={{ cursor: "pointer" }}
          >
            <h5>Opción 1: Calculadora</h5>
            <p>Ir a la calculadora</p>
          </div>
        </div>

        {/* Opción 2: Compras */}
        <div className="col-md-3">
          <div
            className="card p-4 shadow-sm"
            id="goToComprasBtn"
            onClick={goToCompras}
            style={{ cursor: "pointer" }}
          >
            <h5>Opción 2: Compras</h5>
            <p>Ir a la sección de compras</p>
          </div>
        </div>

         {/* Cuadro 3: GASTOS */}
        <div className="col-md-3">
          <div
            className="card p-4 shadow-sm"
            id="goToGastosBtn"
            onClick={goToGastos}
            style={{ cursor: "pointer" }}
          >
            <div className="card-body">
              <h5>Opción 3</h5>
              <p>Gastos</p>
            </div>
          </div>
        </div>

        {/* Opción 4 */}
        <div className="col-md-3">
          <div className="card p-4 shadow-sm">
            <h5>Opción 4</h5>
            <p>Próximamente...</p>
          </div>
        </div>
      </div>

      <button className="btn btn-danger mt-4" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}

export default Home;
