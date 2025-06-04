const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Función para calcular el costo de envío
function calcularCostoEnvio(peso, precioDEC) {
  const tarifas = [
    { max: 0.5, costo: 19.89 },
    { max: 1.0, costo: 35.75 },
    { max: 1.5, costo: 48.10 },
    { max: 2.0, costo: 58.50 },
    { max: 2.5, costo: 71.50 },
    { max: 3.0, costo: 78.00 },
    { max: 3.5, costo: 84.50 },
    { max: 4.0, costo: 91.00 },
    { max: 4.5, costo: 97.50 },
    { max: 5.0, costo: 104.00 },
    { max: 5.5, costo: 110.50 },
    { max: 6.0, costo: 117.00 },
    { max: 6.5, costo: 123.50 },
    { max: 7.0, costo: 130.00 },
    { max: 7.5, costo: 136.50 },
    { max: 8.0, costo: 143.00 },
    { max: 8.5, costo: 149.50 },
    { max: 9.0, costo: 156.00 },
    { max: 9.5, costo: 162.50 },
    { max: Infinity, costo: 169.00 }
  ];

  const honorarios = precioDEC <= 100 ? 16.3 :
                    precioDEC <= 200 ? 25.28 :
                    precioDEC <= 1000 ? 39.76 :
                    precioDEC <= 2000 ? 60.16 : 0;

  const seguro = precioDEC <= 100 ? 8.86 :
                 precioDEC <= 200 ? 15.98 :
                 precioDEC <= 300 ? 21.10 : 0;

  const tarifaBase = tarifas.find(t => peso <= t.max)?.costo || 169.00;
  return tarifaBase + honorarios + seguro;
}

// Ruta para guardar producto
router.post('/registrar', async (req, res) => {
  try {
    const { precioUSA, precioDEC, peso, fechaCompra } = req.body;

    // Ajustar fecha para UTC
    const fechaCompraUTC = fechaCompra ? new Date(fechaCompra) : new Date();
    fechaCompraUTC.setHours(12, 0, 0, 0); // mediodía UTC

    const costoEnvio = calcularCostoEnvio(peso, precioDEC);
    const precioSoles = precioUSA * 3.8;
    const valorTotal = precioSoles + costoEnvio;

    const nuevoProducto = new Product({
      ...req.body,
      fechaCompra: fechaCompraUTC,
      costoEnvio,
      precioSoles,
      valorTotal
    });

    await nuevoProducto.save();
    res.json({ ok: true, producto: nuevoProducto });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al registrar producto', error: err.message });
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener productos', error: err.message });
  }
});

// Obtener un solo producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al buscar producto', error: err.message });
  }
});

// Actualizar producto completo (editar)
router.put('/editar/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const producto = await Product.findById(id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    // Actualizar campos de producto
    Object.assign(producto, {
      tipoProducto: data.tipoProducto,
      modelo: data.modelo,
      procesador: data.procesador,
      tamaño: data.tamaño,
      ram: data.ram,
      ssd: data.ssd,
      almacenamiento: data.almacenamiento,
      conexion: data.conexion,
      serie: data.serie,
      estado: data.estado,
      caja: data.caja,
      precioUSA: parseFloat(data.precioUSA) || 0,
      precioDEC: parseFloat(data.precioDEC) || 0,
      peso: parseFloat(data.peso) || 0,
      tracking: data.tracking,
      fechaCompra: data.fechaCompra ? new Date(data.fechaCompra) : producto.fechaCompra
    });

    // Recalcular costos y totales
    producto.costoEnvio = calcularCostoEnvio(producto.peso, producto.precioDEC);
    producto.precioSoles = producto.precioUSA * 3.8;
    producto.valorTotal = producto.precioSoles + producto.costoEnvio;

    await producto.save();
    res.json({ ok: true, producto, mensaje: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar producto', error: err.message });
  }
});

// Actualizar producto para registrar venta
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { valorVenta, fechaVenta } = req.body;

    if (valorVenta == null || !fechaVenta) {
      return res.status(400).json({ msg: 'Faltan campos requeridos: valorVenta y fechaVenta' });
    }

    const producto = await Product.findById(id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }

    producto.valorVenta = parseFloat(valorVenta);
    producto.fechaVenta = new Date(fechaVenta);
    producto.estatus = 'Vendido';

    await producto.save();
    res.json({ ok: true, producto, mensaje: 'Venta registrada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al registrar venta', error: err.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Product.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    res.json({ ok: true, mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar producto', error: err.message });
  }
});

module.exports = router;
