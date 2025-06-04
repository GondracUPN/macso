import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Calculator() {
  const navigate = useNavigate();  // Hook para navegar a otra página
  const [precioUSA, setPrecioUSA] = useState("");
  const [precioDEC, setPrecioDEC] = useState("");
  const [peso, setPeso] = useState("");
  const [porcentajeGanancia, setPorcentajeGanancia] = useState("");
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [honorarios, setHonorarios] = useState(0);
  const [seguro, setSeguro] = useState(0);
  const [precioFinal, setPrecioFinal] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(0);
  const [ganancia, setGanancia] = useState(0);
  const [impuestoUSA, setImpuestoUSA] = useState(0);  // Impuesto para calculadora detallada
  const [tipoCalculadora, setTipoCalculadora] = useState("resum");

  // Cálculo del costo de envío según el peso y el precio DEC
  const calcularPrecioEnvio = (peso, precioDEC) => {
    if (peso <= 0.5) return 19.89;
    if (peso <= 1.0) return 35.75;
    if (peso <= 1.5) return 48.10;
    if (peso <= 2.0) return 58.50;
    if (peso <= 2.5) return 71.50;
    if (peso <= 3.0) return 78.00;
    if (peso <= 3.5) return 84.50;
    if (peso <= 4.0) return 91.00;
    if (peso <= 4.5) return 97.50;
    if (peso <= 5.0) return 104.00;
    if (peso <= 5.5) return 110.50;
    if (peso <= 6.0) return 117.00;
    if (peso <= 6.5) return 123.50;
    if (peso <= 7.0) return 130.00;
    if (peso <= 7.5) return 136.50;
    if (peso <= 8.0) return 143.00;
    if (peso <= 8.5) return 149.50;
    if (peso <= 9.0) return 156.00;
    if (peso <= 9.5) return 162.50;
    return 169.00;
  };

  // Cálculo de honorarios según el precio DEC
  const calcularHonorarios = (precioDEC) => {
    if (precioDEC <= 100) return 16.3;
    if (precioDEC <= 200) return 25.28;
    if (precioDEC <= 1000) return 39.76;
    if (precioDEC <= 2000) return 60.16;
    return 0;
  };

  // Cálculo de seguro según el precio DEC
  const calcularSeguro = (precioDEC) => {
    if (precioDEC <= 100) return 8.86;
    if (precioDEC <= 200) return 15.98;
    if (precioDEC <= 300) return 21.1;
    return 0;
  };

  // Cálculo del impuesto USA (7%)
  const calcularImpuestoUSA = (precioUSA) => {
    return Math.round(((parseFloat(precioUSA) * 0.07)*3.8) * 100) / 100;  // Redondeo a 2 decimales
  };

  const handleCalcular = () => {
    const precioSoles = parseFloat(precioUSA) * 3.8;
    const tarifaEnvio = calcularPrecioEnvio(parseFloat(peso), parseFloat(precioDEC));  // Calculando costo de envío con precio DEC
    const tarifaHonorarios = calcularHonorarios(parseFloat(precioDEC));
    const tarifaSeguro = calcularSeguro(parseFloat(precioDEC));

    let impuesto = 0;
    if (tipoCalculadora === "detall") {
      impuesto = calcularImpuestoUSA(precioUSA);  // Solo calcular si es la detallada
      setImpuestoUSA(impuesto);  // Establecer el impuesto calculado
    } else {
      setImpuestoUSA(0);  // En la calculadora resumida no hay impuesto
    }

    const costoEnvioFinal = tarifaEnvio + tarifaHonorarios + tarifaSeguro;  // No sumar el impuesto al costo de envío
    setCostoEnvio(costoEnvioFinal);

    const precioFinalCalculo = precioSoles + costoEnvioFinal + impuesto;  // Sumar el impuesto solo en la detallada
    const precioFinalRedondeado = Math.ceil(precioFinalCalculo); // Redondear el precio final hacia arriba
    setPrecioFinal(precioFinalRedondeado);

    // Calcular la ganancia
    const gananciaCalculada = Math.ceil((parseFloat(porcentajeGanancia) / 100) * precioFinalRedondeado);  // Redondeo hacia arriba
    setGanancia(gananciaCalculada);

    // Cálculo del precio de venta: Costo Final + Ganancia
    const precioVentaCalculado = precioFinalRedondeado + gananciaCalculada;

    // Redondear el precio de venta al siguiente múltiplo de 10
    const precioVentaRedondeado = Math.ceil(precioVentaCalculado / 10) * 10;
    setPrecioVenta(precioVentaRedondeado);
  };

  // Efecto que se ejecuta cada vez que el precio, el porcentaje o el peso cambian
  useEffect(() => {
    if (precioUSA && precioDEC && peso && porcentajeGanancia !== "") {
      handleCalcular();
    }
  }, [precioUSA, precioDEC, peso, porcentajeGanancia, tipoCalculadora]);

  // Función para volver a la página principal
  const goToHome = () => {
    navigate("/home");  // Redirigir a la página principal
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Calculadora {tipoCalculadora === "resum" ? "Resumida" : "Detallada"}</h2>
      <div className="text-center mb-4">
        <button className="btn btn-primary" onClick={() => setTipoCalculadora("resum")}>Calculadora Resumida</button>
        <button className="btn btn-secondary ms-2" onClick={() => setTipoCalculadora("detall")}>Calculadora Detallada</button>
      </div>

      {tipoCalculadora === "resum" ? (
        <div className="card p-4 shadow-sm">
        <div className="row">
          {/* PRECIO USA */}
          <div className="col-md-6">
            <label className="form-label">Precio USA</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={precioUSA}
              onChange={(e) => setPrecioUSA(e.target.value)}
              required
            />
          </div>

          {/* PRECIO DEC */}
          <div className="col-md-6">
            <label className="form-label">Precio DEC</label>
            <input
              type="number"
              className="form-control form-control-sm"
              value={precioDEC}
              onChange={(e) => setPrecioDEC(e.target.value)}
              required
            />
          </div>
        </div>
          <div className="mb-3">
            <label className="form-label">Peso (kg)</label>
            <input
              type="number"
              className="form-control"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Porcentaje de Ganancia</label>
            <div className="d-flex">
              <input
                type="number"
                className="form-control me-2"
                value={porcentajeGanancia}
                onChange={(e) => setPorcentajeGanancia(e.target.value)}
                style={{ width: "80px" }}
                required
              />
              <div className="input-group">
                <span className="input-group-text">%</span>
                <span className="input-group-text">Ganancia: S/ {ganancia}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p><strong>Precio en Soles: </strong>S/ {precioUSA * 3.8}</p>
            <p><strong>Costo de Envío: </strong>S/ {costoEnvio}</p>
            <p><strong>Costo Final: </strong>S/ {precioFinal}</p>
            <p><strong>Precio de Venta: </strong>S/ {precioVenta}</p>
          </div>
        </div>
      ) : (
        <div className="card p-4 shadow-sm">
          <p><strong>Impuesto USA (7%): </strong>S/ {impuestoUSA}</p>
          <div className="mt-4">
            <p><strong>Precio en Soles: </strong>S/ {precioUSA * 3.8}</p>
            <p><strong>Costo de Envío: </strong>S/ {costoEnvio}</p>
            <p><strong>Impuesto USA (7%): </strong>S/ {impuestoUSA}</p>
            <p><strong>Costo Final: </strong>S/ {precioFinal}</p>
            <p><strong>Precio de Venta: </strong>S/ {precioVenta}</p>
          </div>
        </div>
      )}
      <div className="text-center mt-4">
        <button className="btn btn-warning" onClick={goToHome}>Volver a la Página Principal</button>
      </div>
    </div>
  );
}

export default Calculator;
