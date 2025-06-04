import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Compras() {
  const navigate = useNavigate();

  // === Estados de modal/vista ===
  const [showModal, setShowModal] = useState(false);           // Crear/editar compra
  const [purchaseMode, setPurchaseMode] = useState("create");  // "create" | "edit"
  const [showVentaModal, setShowVentaModal] = useState(false); // Crear/editar venta
  const [saleMode, setSaleMode] = useState("create");          // "create" | "edit"
  const [modalModo, setModalModo] = useState("");              // "producto" | "venta" para detalle
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [currentProductId, setCurrentProductId] = useState(null);

  // === Formulario de venta ===
  const [precioVenta, setPrecioVenta] = useState("");
  const [fechaVenta, setFechaVenta] = useState(() => {
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset() * 60000;
    return new Date(ahora - offset).toISOString().split("T")[0];
  });

  // === Formulario de compra ===
  const [tipoProducto, setTipoProducto] = useState("");
  const [modelo, setModelo] = useState("");
  const [procesador, setProcesador] = useState("");
  const [tamaño, setTamaño] = useState("");
  const [ram, setRam] = useState("");
  const [ssd, setSsd] = useState("");
  const [almacenamiento, setAlmacenamiento] = useState("");
  const [conexion, setConexion] = useState("");
  const [serie, setSerie] = useState("");
  const [estado, setEstado] = useState("");
  const [caja, setCaja] = useState("");
  const [precioUSA, setPrecioUSA] = useState("");
  const [precioDEC, setPrecioDEC] = useState("");
  const [peso, setPeso] = useState("");
  const [fechaCompra, setFechaCompra] = useState(() => {
    const ahora = new Date();
    const offset = ahora.getTimezoneOffset() * 60000;
    return new Date(ahora - offset).toISOString().split("T")[0];
  });
  const [tracking, setTracking] = useState("");

  // === Listado de productos ===
  const [productos, setProductos] = useState([]);

  // === Helpers ===
  const goToHome = () => navigate("/home");

  const resetFormulario = () => {
    setTipoProducto("");
    setModelo("");
    setProcesador("");
    setTamaño("");
    setRam("");
    setSsd("");
    setAlmacenamiento("");
    setConexion("");
    setSerie("");
    setEstado("");
    setCaja("");
    setPrecioUSA("");
    setPrecioDEC("");
    setPeso("");
    setFechaCompra(new Date().toISOString().split("T")[0]);
    setTracking("");
  };

  const fetchProductos = async () => {
    try {
      const res = await axios.get(
        "https://macso.onrender.com/api/producto"
      );
      console.log("Respuesta del backend:", res.data);
      if (Array.isArray(res.data)) {
        setProductos(res.data);
      } else if (Array.isArray(res.data.productos)) {
        setProductos(res.data.productos);
      } else {
        console.warn("La respuesta del backend no contiene un array válido:", res.data);
        setProductos([]);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setProductos([]);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // === Registrar nueva compra ===
  const registrarCompra = async () => {
    try {
      const datos = {
        tipoProducto,
        modelo,
        procesador,
        tamaño,
        ram,
        ssd,
        almacenamiento,
        conexion,
        serie,
        estado,
        caja,
        precioUSA: parseFloat(precioUSA) || 0,
        precioDEC: parseFloat(precioDEC) || 0,
        peso: parseFloat(peso) || 0,
        fechaCompra,
        tracking,
      };
      console.log("Enviando datos al backend:", datos);
      await axios.post(
<<<<<<< HEAD
        "/api/producto/registrar",
=======
        "https://macso.onrender.com/api/producto/registrar",
>>>>>>> d7cb786 (Actualización: se corrigieron errores y se agregó nueva funcionalidad)
        datos
      );
      setShowModal(false);
      fetchProductos();
    } catch (error) {
      console.error("Error al registrar producto:", error);
      alert("Error al registrar producto: " + (error.response?.data?.msg || error.message));
    }
  };

  // === Actualizar compra existente ===
  const updateCompra = async () => {
    try {
      const datos = {
        tipoProducto,
        modelo,
        procesador,
        tamaño,
        ram,
        ssd,
        almacenamiento,
        conexion,
        serie,
        estado,
        caja,
        precioUSA: parseFloat(precioUSA) || 0,
        precioDEC: parseFloat(precioDEC) || 0,
        peso: parseFloat(peso) || 0,
        fechaCompra,
        tracking,
      };
      console.log("Actualizando datos en backend:", datos);
      await axios.put(
        `https://macso.onrender.com/api/producto/editar/${currentProductId}`,
        datos
      );
      setShowModal(false);
      fetchProductos();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert("Error al actualizar producto: " + (error.response?.data?.msg || error.message));
    }
  };

  // === Registrar nueva venta ===
  const registrarVenta = async () => {
    try {
      const datosVenta = {
        valorVenta: parseFloat(precioVenta),
        fechaVenta,
        estatus: "Vendido",
      };
      await axios.put(
        `https://macso.onrender.com/api/producto/${currentProductId}`,
        datosVenta
      );
      setShowVentaModal(false);
      fetchProductos();
    } catch (error) {
      console.error("Error al registrar venta:", error);
      alert("Error al registrar venta: " + (error.response?.data?.msg || error.message));
    }
  };

  // === Actualizar venta existente ===
  const updateVenta = async () => {
    try {
      const datosVenta = {
        valorVenta: parseFloat(precioVenta),
        fechaVenta,
      };
      await axios.put(
        `https://macso.onrender.com/api/producto/${currentProductId}`,
        datosVenta
      );
      setShowVentaModal(false);
      fetchProductos();
    } catch (error) {
      console.error("Error al actualizar venta:", error);
      alert("Error al actualizar venta: " + (error.response?.data?.msg || error.message));
    }
  };

  // === Handlers para detalle vista ===
  const handleVerProductoView = (prod) => {
    setProductoSeleccionado(prod);
    setModalModo("producto");
  };
  const handleVerVentaView = (prod) => {
    setProductoSeleccionado(prod);
    setModalModo("venta");
  };
  const cerrarVista = () => {
    setProductoSeleccionado(null);
    setModalModo("");
  };

  // === Editar/Borrar handlers ===
  const handleEditarProducto = (prod) => {
    // precarga formulario
    setCurrentProductId(prod._id);
    setTipoProducto(prod.tipoProducto);
    setModelo(prod.modelo || "");
    setProcesador(prod.procesador || "");
    setTamaño(prod.tamaño || "");
    setRam(prod.ram || "");
    setSsd(prod.ssd || "");
    setAlmacenamiento(prod.almacenamiento || "");
    setConexion(prod.conexion || "");
    setSerie(prod.serie || "");
    setEstado(prod.estado || "");
    setCaja(prod.caja || "");
    setPrecioUSA(prod.precioUSA?.toString() || "");
    setPrecioDEC(prod.precioDEC?.toString() || "");
    setPeso(prod.peso?.toString() || "");
    setFechaCompra(prod.fechaCompra?.split("T")[0] || new Date().toISOString().split("T")[0]);
    setTracking(prod.tracking || "");
    setPurchaseMode("edit");
    setShowModal(true);
  };

  const handleBorrarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este producto?")) return;
    try {
      await axios.delete(
        `https://macso.onrender.com/api/producto/${id}`
      );
      fetchProductos();
    } catch (error) {
      console.error("Error al borrar producto:", error);
      alert("No se pudo borrar el producto.");
    }
  };

  const handleEditarVenta = (prod) => {
    // cerrar el modal de detalle de venta
    setModalModo("");
    setProductoSeleccionado(null);

    // precargar datos en el formulario de venta
    setCurrentProductId(prod._id);
    setPrecioVenta(prod.valorVenta?.toString() || "");
    setFechaVenta(prod.fechaVenta?.split("T")[0] || new Date().toISOString().split("T")[0]);

    // pasar a modo 'edit' y abrir el modal de venta
    setSaleMode("edit");
    setShowVentaModal(true);
  };

  const handleNewCompra = () => {
    resetFormulario();
    setPurchaseMode("create");
    setShowModal(true);
  };
  const handleNewVenta = (id) => {
    setCurrentProductId(id);
    setPrecioVenta("");
    setFechaVenta(new Date().toISOString().split("T")[0]);
    setSaleMode("create");
    setShowVentaModal(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Compras</h2>

      <div className="d-flex justify-content-between my-3">
        <button className="btn btn-primary" onClick={handleNewCompra}>
          Registrar Compra
        </button>
        <button className="btn btn-secondary" onClick={goToHome}>
          ⬅ Volver a la Página Principal
        </button>
      </div>

      <div className="card p-4 shadow-sm mt-4">
        {!Array.isArray(productos) || productos.length === 0 ? (
          <p className="text-center">No hay productos registrados aún.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio USA</th>
                <th>Precio Soles</th>
                <th>Peso</th>
                <th>Costo de Envío</th>
                <th>Valor Total</th>
                <th>Fecha Compra</th>
                <th>Estatus</th>
                <th>Acciones</th>
                <th>Editar/Borrar</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod, idx) => (
                <tr key={idx}>
                  <td>
                    {prod.tipoProducto}{" "}
                    <button
                      className="btn btn-link btn-sm"
                      onClick={() => handleVerProductoView(prod)}
                    >
                      Ver Producto
                    </button>
                  </td>
                  <td>S/ {prod.precioUSA}</td>
                  <td>S/ {prod.precioSoles}</td>
                  <td>{prod.peso} kg</td>
                  <td>S/ {prod.costoEnvio}</td>
                  <td>S/ {prod.valorTotal}</td>
                  <td>
                    {prod.fechaCompra
                      ? new Date(prod.fechaCompra).toLocaleDateString("es-PE", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                      : "-"}
                  </td>
                  <td>{prod.estatus}</td>
                  <td>
                    {prod.estatus === "En venta" ? (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleNewVenta(prod._id)}
                      >
                        Marcar como Vendido
                      </button>
                    ) : prod.estatus === "Vendido" ? (
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleVerVentaView(prod)}
                      >
                        Ver Venta
                      </button>
                    ) : null}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEditarProducto(prod)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => handleBorrarProducto(prod._id)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== Modal Crear/Editar Compra ===== */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  {purchaseMode === "edit" ? "Editar Producto" : "Registrar Compra"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row">
                  {/* Columna izq: selección de producto y dependientes */}
                  <div className="col-md-6">
                    <label className="form-label">Tipo de Producto</label>
                    <select
                      className="form-control"
                      value={tipoProducto}
                      onChange={e => {
                        setTipoProducto(e.target.value);
                        setModelo("");
                        setTamaño("");
                        setProcesador("");
                        setSerie("");
                      }}
                    >
                      <option value="">Seleccione opción</option>
                      <option value="Macbook">Macbook</option>
                      <option value="Ipad">Ipad</option>
                      <option value="Iphone">Iphone</option>
                      <option value="Apple Watch">Apple Watch</option>
                      <option value="Otros">Otros</option>
                    </select>

                    {/* Macbook */}
                    {tipoProducto === "Macbook" && (
                      <>
                        <label className="form-label mt-3">Modelo</label>
                        <select
                          className="form-control"
                          value={modelo}
                          onChange={e => setModelo(e.target.value)}
                        >
                          <option value="">Seleccione opción</option>
                          <option value="Air">Air</option>
                          <option value="Pro">Pro</option>
                        </select>

                        <label className="form-label mt-3">Procesador</label>
                        <select
                          className="form-control"
                          value={procesador}
                          onChange={e => setProcesador(e.target.value)}
                        >
                          <option value="">Seleccione opción</option>
                          <option value="M1">M1</option>
                          <option value="M2">M2</option>
                          <option value="M3">M3</option>
                          <option value="M4">M4</option>
                        </select>

                        <label className="form-label mt-3">Tamaño</label>
                        <select
                          className="form-control"
                          value={tamaño}
                          onChange={e => setTamaño(e.target.value)}
                        >
                          <option value="">Seleccione opción</option>
                          {modelo === "Air" ? (
                            <>
                              <option value="13">13</option>
                              <option value="15">15</option>
                            </>
                          ) : (
                            <>
                              <option value="13">13</option>
                              <option value="14">14</option>
                              <option value="16">16</option>
                            </>
                          )}
                        </select>

                        <label className="form-label mt-3">Almacenamiento</label>
                        <select
                          className="form-control"
                          value={almacenamiento}
                          onChange={e => setAlmacenamiento(e.target.value)}
                        >
                          <option value="">Seleccione opción</option>
                          <option value="256GB">256GB</option>
                          <option value="512GB">512GB</option>
                          <option value="1TB">1TB</option>
                          <option value="2TB">2TB</option>
                        </select>
                      </>
                    )}

                    {/* Ipad */}
                    {tipoProducto === "Ipad" && (
                      <>
                        <label className="form-label mt-3">Modelo</label>
                        <select
                          className="form-control"
                          value={modelo}
                          onChange={e => {
                            setModelo(e.target.value);
                            setTamaño("");
                            setProcesador("");
                            setSerie("");
                          }}
                        >
                          <option value="">Seleccione opción</option>
                          <option value="Pro">Pro</option>
                          <option value="Air">Air</option>
                          <option value="Mini">Mini</option>
                          <option value="Base">Base</option>
                        </select>

                        {/* Pro */}
                        {modelo === "Pro" && (
                          <>
                            <label className="form-label mt-3">Tamaño</label>
                            <select
                              className="form-control"
                              value={tamaño}
                              onChange={e => {
                                setTamaño(e.target.value);
                                setProcesador("");
                              }}
                            >
                              <option value="">Seleccione opción</option>
                              <option value="11">11</option>
                              <option value="12.9">12.9</option>
                              <option value="13">13</option>
                            </select>
                            {tamaño && (
                              <>
                                <label className="form-label mt-3">Procesador</label>
                                <select
                                  className="form-control"
                                  value={procesador}
                                  onChange={e => setProcesador(e.target.value)}
                                >
                                  <option value="">Seleccione opción</option>
                                  <option value="M1">M1</option>
                                  <option value="M2">M2</option>
                                  <option value="M4">M4</option>
                                </select>
                              </>
                            )}
                          </>
                        )}

                        {/* Air */}
                        {modelo === "Air" && (
                          <>
                            <label className="form-label mt-3">Tamaño</label>
                            <select
                              className="form-control"
                              value={tamaño}
                              onChange={e => {
                                setTamaño(e.target.value);
                                setProcesador("");
                              }}
                            >
                              <option value="">Seleccione opción</option>
                              <option value="10.9">10.9</option>
                              <option value="11">11</option>
                              <option value="13">13</option>
                            </select>
                            {tamaño === "10.9" && (
                              <>
                                <label className="form-label mt-3">Procesador</label>
                                <select
                                  className="form-control"
                                  value={procesador}
                                  onChange={e => setProcesador(e.target.value)}
                                >
                                  <option value="">Seleccione opción</option>
                                  <option value="Apple A14">Apple A14</option>
                                  <option value="M1">M1</option>
                                </select>
                              </>
                            )}
                            {(tamaño === "11" || tamaño === "13") && (
                              <>
                                <label className="form-label mt-3">Procesador</label>
                                <select
                                  className="form-control"
                                  value={procesador}
                                  onChange={e => setProcesador(e.target.value)}
                                >
                                  <option value="">Seleccione opción</option>
                                  <option value="M2">M2</option>
                                  <option value="M3">M3</option>
                                </select>
                              </>
                            )}
                          </>
                        )}

                        {/* Mini */}
                        {modelo === "Mini" && (
                          <>
                            <label className="form-label mt-3">Serie</label>
                            <select
                              className="form-control"
                              value={serie}
                              onChange={e => setSerie(e.target.value)}
                            >
                              <option value="">Seleccione opción</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                            </select>
                          </>
                        )}

                        {/* Base */}
                        {modelo === "Base" && (
                          <>
                            <label className="form-label mt-3">Serie</label>
                            <select
                              className="form-control"
                              value={serie}
                              onChange={e => setSerie(e.target.value)}
                            >
                              <option value="">Seleccione opción</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                              <option value="11">11</option>
                            </select>
                          </>
                        )}

                        <label className="form-label mt-3">Conexión</label>
                        <select
                          className="form-control"
                          value={conexion}
                          onChange={e => setConexion(e.target.value)}
                        >
                          <option value="">Seleccione opción</option>
                          <option value="WiFi">WiFi</option>
                          <option value="WiFi + LTE">WiFi + LTE</option>
                        </select>
                      </>
                    )}

                    {/* iPhone */}
                    {tipoProducto === "Iphone" && (
                      <>
                        <label className="form-label mt-3">Serie</label>
                        <select
                          className="form-control"
                          value={serie}
                          onChange={e => {
                            setSerie(e.target.value);
                            setModelo("");
                          }}
                        >
                          <option value="">Seleccione opción</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                          <option value="13">13</option>
                          <option value="14">14</option>
                          <option value="15">15</option>
                          <option value="16">16</option>
                        </select>
                        {serie && (
                          <>
                            <label className="form-label mt-3">Modelo</label>
                            <select
                              className="form-control"
                              value={modelo}
                              onChange={e => setModelo(e.target.value)}
                            >
                              <option value="">Seleccione opción</option>
                              <option value="Base">Base</option>
                              <option value="Pro">Pro</option>
                              <option value="Pro Max">Pro Max</option>
                              {(serie === "12" || serie === "13") && (
                                <option value="Mini">Mini</option>
                              )}
                              {["14", "15", "16"].includes(serie) && (
                                <option value="Plus">Plus</option>
                              )}
                            </select>
                          </>
                        )}
                      </>
                    )}
                    {(tipoProducto === "Ipad" || tipoProducto === "Iphone") && (
                      <>
                        <label className="form-label mt-3">Almacenamiento</label>
                        <select
                          className="form-control"
                          value={almacenamiento}
                          onChange={e => setAlmacenamiento(e.target.value)}
                        >
                          <option value="">Seleccione opción</option>
                          <option value="64GB">64GB</option>
                          <option value="128GB">128GB</option>
                          <option value="256GB">256GB</option>
                          <option value="512GB">512GB</option>
                          <option value="1TB">1TB</option>
                        </select>
                      </>
                    )}

                    {tipoProducto === "Apple Watch" && (
                      <>
                        <label className="form-label mt-3">Conexión</label>
                        <select
                          className="form-control"
                          value={conexion}
                          onChange={e => setConexion(e.target.value)}
                        >
                          <option value="">Seleccione opción</option>
                          <option value="GPS">GPS</option>
                          <option value="GPS + LTE">GPS + LTE</option>
                        </select>
                      </>
                    )}

                    {/* Comunes a todos */}
                    <label className="form-label mt-3">Estado</label>
                    <select
                      className="form-control"
                      value={estado}
                      onChange={e => setEstado(e.target.value)}
                    >
                      <option value="">Seleccione opción</option>
                      <option>Nuevo</option>
                      <option>Usado</option>
                      <option>Reparar</option>
                    </select>
                    {estado === "Usado" && (
                      <>
                        <label className="form-label mt-3">
                          ¿Tiene caja o algo extra?
                        </label>
                        <select
                          className="form-control"
                          value={caja}
                          onChange={e => setCaja(e.target.value)}
                        >
                          <option value="">Seleccione opción</option>
                          <option>Si</option>
                          <option>No</option>
                        </select>
                      </>
                    )}
                  </div>

                  {/* Columna der: precios, fecha y tracking */}
                  <div className="col-md-6">
                    <label className="form-label">Precio USA</label>
                    <input
                      type="number"
                      className="form-control"
                      value={precioUSA}
                      onChange={e => setPrecioUSA(e.target.value)}
                    />

                    <label className="form-label mt-3">Precio DEC</label>
                    <input
                      type="number"
                      className="form-control"
                      value={precioDEC}
                      onChange={e => setPrecioDEC(e.target.value)}
                    />

                    <label className="form-label mt-3">Peso (kg)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={peso}
                      onChange={e => setPeso(e.target.value)}
                    />

                    <label className="form-label mt-3">Fecha de Compra</label>
                    <input
                      type="date"
                      className="form-control"
                      value={fechaCompra}
                      onChange={e => setFechaCompra(e.target.value)}
                    />

                    <label className="form-label mt-3">Número de Tracking</label>
                    <input
                      type="text"
                      className="form-control"
                      value={tracking}
                      onChange={e => setTracking(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-success"
                  onClick={purchaseMode === "edit" ? updateCompra : registrarCompra}
                >
                  {purchaseMode === "edit" ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Crear/Editar Venta ===== */}
      {showVentaModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  {saleMode === "edit" ? "Editar Venta" : "Registrar Venta"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowVentaModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Precio de Venta (S/)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={precioVenta}
                    onChange={e => setPrecioVenta(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Fecha de Venta</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fechaVenta}
                    onChange={e => setFechaVenta(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowVentaModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={saleMode === "edit" ? updateVenta : registrarVenta}
                >
                  {saleMode === "edit" ? "Actualizar Venta" : "Confirmar Venta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Detalle Producto ===== */}
      {productoSeleccionado && modalModo === "producto" && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Producto</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarVista}
                ></button>
              </div>
              <div className="modal-body">
                {modalModo === "producto" && (
                  <>
                    <p><strong>Tipo:</strong> {productoSeleccionado.tipoProducto}</p>

                    {productoSeleccionado.tipoProducto === "Macbook" && (
                      <>
                        <p><strong>Modelo:</strong> {productoSeleccionado.modelo || "-"}</p>
                        <p><strong>Procesador:</strong> {productoSeleccionado.procesador || "-"}</p>
                        <p><strong>Tamaño:</strong> {productoSeleccionado.tamaño || "-"}</p>
                        <p><strong>RAM:</strong> {productoSeleccionado.ram || "-"}</p>
                        <p><strong>SSD:</strong> {productoSeleccionado.ssd || "-"}</p>
                      </>
                    )}

                    {productoSeleccionado.tipoProducto === "Ipad" && (
                      <>
                        <p><strong>Modelo:</strong> {productoSeleccionado.modelo || "-"}</p>
                        <p><strong>Procesador:</strong> {productoSeleccionado.procesador || "-"}</p>
                        <p><strong>Almacenamiento:</strong> {productoSeleccionado.almacenamiento || "-"}</p>
                        <p><strong>Conexión:</strong> {productoSeleccionado.conexion || "-"}</p>
                      </>
                    )}

                    {productoSeleccionado.tipoProducto === "Iphone" && (
                      <>
                        <p><strong>Serie:</strong> {productoSeleccionado.serie || "-"}</p>
                        {parseInt(productoSeleccionado.serie) >= 11 && (
                          <p><strong>Modelo:</strong> {productoSeleccionado.modelo || "-"}</p>
                        )}
                        <p><strong>Almacenamiento:</strong> {productoSeleccionado.almacenamiento || "-"}</p>
                      </>
                    )}

                    {productoSeleccionado.tipoProducto === "Apple Watch" && (
                      <>
                        <p><strong>Serie:</strong> {productoSeleccionado.serie || "-"}</p>
                        <p><strong>Conexión:</strong> {productoSeleccionado.conexion || "-"}</p>
                      </>
                    )}

                    <p><strong>Estado:</strong> {productoSeleccionado.estado || "-"}</p>
                    {productoSeleccionado.estado === "Usado" && (
                      <p><strong>Caja:</strong> {productoSeleccionado.caja || "-"}</p>
                    )}

                    <p><strong>Precio USA:</strong> S/ {productoSeleccionado.precioUSA}</p>
                    <p><strong>Precio Soles:</strong> S/ {productoSeleccionado.precioSoles}</p>
                    <p><strong>Peso:</strong> {productoSeleccionado.peso} kg</p>
                    <p><strong>Costo Envío:</strong> S/ {productoSeleccionado.costoEnvio}</p>
                    <p><strong>Valor Total:</strong> S/ {productoSeleccionado.valorTotal}</p>
                    <p><strong>Tracking:</strong> {productoSeleccionado.tracking}</p>
                    <p><strong>Fecha de Compra:</strong> {productoSeleccionado.fechaCompra ? new Date(productoSeleccionado.fechaCompra).toLocaleDateString() : "-"}</p>
                    <p><strong>Estatus:</strong> {productoSeleccionado.estatus}</p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarVista}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Detalle Venta ===== */}
      {productoSeleccionado && modalModo === "venta" && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Información de Venta</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cerrarVista}
                ></button>
              </div>
              <div className="modal-body">
                {modalModo === "venta" && (
                  <div className="mt-4 p-3 bg-light rounded">
                    <h5>Información de Venta</h5>
                    <p><strong>Fecha de Venta:</strong> {productoSeleccionado.fechaVenta ? new Date(productoSeleccionado.fechaVenta).toLocaleDateString() : "-"}</p>
                    <p><strong>Precio de Venta:</strong> S/ {productoSeleccionado.valorVenta}</p>
                    <p><strong>Precio de Compra:</strong> S/ {productoSeleccionado.valorTotal}</p>
                    <p><strong>Ganancia:</strong> S/ {productoSeleccionado.ganancia?.toFixed(2) || '0.00'}</p>
                    <p><strong>Porcentaje de Ganancia:</strong> {productoSeleccionado.porcentajeGanancia?.toFixed(2) || '0.00'}%</p>
                  </div>
                )}              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={cerrarVista}>
                  Cerrar
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEditarVenta(productoSeleccionado)}
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Compras;
