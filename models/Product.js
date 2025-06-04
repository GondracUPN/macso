const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  tipoProducto: { type: String, required: true },  
  modelo: { type: String, default: null },  
  procesador: { type: String, default: null },  
  tamaño: { type: String, default: null },  
  ram: { type: String, default: null },  
  ssd: { type: String, default: null },  
  almacenamiento: { type: String, default: null },  
  conexion: { type: String, default: null },  
  serie: { type: String, default: null },  
  estado: { type: String, enum: ['Nuevo', 'Usado', 'Reparar'], default: 'Nuevo' },  
  caja: { type: String, enum: ['Si', 'No', ''], default: '' },
  precioUSA: { type: Number, required: true },  
  precioDEC: { type: Number, required: true },  
  peso: { type: Number, required: true },  
  fechaCompra: { type: Date, default: Date.now },  
  tracking: { type: String, default: null },  
  costoEnvio: { type: Number, default: 0 },  
  precioSoles: { type: Number, default: 0 },  
  valorTotal: { type: Number, default: 0 },  
  estatus: { type: String, enum: ['En venta', 'Vendido', 'Reservado'], default: 'En venta' },  
  valorVenta: { type: Number, default: 0 },  
  fechaVenta: { type: Date, default: null },
  ganancia: { type: Number, default: 0 },           // Nuevo campo
  porcentajeGanancia: { type: Number, default: 0 }  // Nuevo campo
});

// Middleware para calcular ganancia antes de guardar
ProductSchema.pre('save', function(next) {
  if (this.estatus === 'Vendido' && this.valorVenta > 0) {
    this.ganancia = this.valorVenta - this.valorTotal;
    this.porcentajeGanancia = this.valorTotal > 0 
      ? (this.ganancia / this.valorVenta) * 100 
      : 0;
  } else {
    this.ganancia = 0;
    this.porcentajeGanancia = 0;
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);