const { ordenes, usuarios, productos, pedidosOrdenes, pedidos, productosInsumos, insumos } = require('../mockData');
const pedidosController = require('./pedidosController');

exports.getOrdenes = (req, res) => {
  for (let i = 0; i < ordenes.length; i++) {
    const orden = ordenes[i];
    orden.pedidos = pedidosOrdenes
      .filter(po => po.ordenId == orden.id)
      .map(po => {
        const pedido = pedidos.find(p => p.id == po.pedidoId);
        const producto = productos.find(prod => prod.id == pedido.productoId);
        return producto ? { id: pedido.id, nombre: producto.nombre, cantidad: pedido.cantidad } : { id: pedido.id, nombre: 'Producto no encontrado', cantidad: pedido.cantidad };
      });
  }
  res.json(ordenes);
};

exports.getOrdenById = (req, res) => {
  const { id } = req.params;
  const orden = ordenes.find(p => p.id == id);
  if (orden) {
    res.json(orden);
  } else {
    res.status(404).json({ message: 'Orden no encontrada' });
  }
};

exports.getOrdenesByUsuario = (req, res) => {
  const { id } = req.params;
  const usuario = usuarios.find(u => u.id == id);
  console.log("id:", id, "usuario", usuario);
  if (usuario) {
    const usuarioOrdenes = ordenes.filter(o => o.clienteId == id);
    console.log("ordenes:", usuarioOrdenes);
    for (let i = 0; i < usuarioOrdenes.length; i++) {
      const orden = usuarioOrdenes[i];
      orden.pedidos = pedidosOrdenes
        .filter(po => po.ordenId == orden.id)
        .map(po => {
          const pedido = pedidos.find(p => p.id == po.pedidoId);
          const producto = productos.find(prod => prod.id == pedido.productoId);
          return producto ? { id: pedido.id, nombre: producto.nombre, cantidad: pedido.cantidad } : { id: pedido.id, nombre: 'Producto no encontrado', cantidad: pedido.cantidad };
        });
    }
    console.log("ordenes ENVIO:", usuarioOrdenes);
    res.json(usuarioOrdenes);
  } else {
    res.json([]);
  }
}

exports.createOrden = (req, res) => {
  const newOrden = req.body.orden;
  const newOrdenPedidos = req.body.pedidosOrden;
  
  if (!newOrden || !newOrdenPedidos) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  newOrden.id = ordenes.length ? ordenes[ordenes.length - 1].id + 1 : 1;
  ordenes.push(newOrden);

  newOrdenPedidos.forEach(pedido => {
    pedidosController.createPedido(pedido);
    this.addPedidoToOrden(newOrden.id, pedido.id);
  });

  res.status(201).json(newOrden);
};

exports.updateOrden = (req, res) => {
  const { id } = req.params;
  const updatedOrden = req.body;
  const ordenIndex = ordenes.findIndex(p => p.id == id);
  if (ordenIndex !== -1) {
    ordenes[ordenIndex] = { ...ordenes[ordenIndex], ...updatedOrden };
    res.json(ordenes[ordenIndex]);
  } else {
    res.status(404).json({ message: 'Orden no encontrada' });
  }
};

exports.deleteOrden = (req, res) => {
  const { id } = req.params;
  const ordenIndex = ordenes.findIndex(p => p.id == id);
  if (ordenIndex !== -1) {
    const deletedOrden = ordenes.splice(ordenIndex, 1);
    res.json(deletedOrden);
  } else {
    res.status(404).json({ message: 'Orden no encontrada' });
  }
};

exports.addPedidoToOrden = (ordenId, pedidoId) => {
  if (ordenId && pedidoId) {
    pedidosOrdenes.push({ ordenId, pedidoId });
  }
};

exports.removePedidoFromOrden = (ordenId, pedidoId) => {
  if (ordenId && pedidoId) {
    const index = pedidosOrdenes.findIndex(po => po.ordenId == ordenId && po.pedidoId == pedidoId);
    if (index !== -1) {
      pedidosOrdenes.splice(index, 1);
    }
  }
};

exports.getPedidosOrden = function() {
  const pedidosOrden = pedidosOrdenes
    .filter(po => po.ordenId == this.id)
    .map(po => pedidos.find(p => p.id == po.pedidoId));
  res.json(pedidosOrden);
};

exports.getUsuariosOrdenes = (req, res) => {
  const usuariosUnicos = {};
  const usuariosOrdenes = ordenes.reduce((result, o) => {
    const usuario = usuarios.find(u => u.id == o.clienteId);
    if (usuario && !usuariosUnicos[usuario.id]) {
      usuariosUnicos[usuario.id] = true;
      result.push({ id: usuario.id, nombre: usuario.email });
    }
    return result;
  }, []);
  res.json(usuariosOrdenes);
};

exports.getInfoOrden = (req, res) => {
  const { id } = req.params;
  const orden = ordenes.find(o => o.id == id);
  
  if (orden) {
    // Agregar pedidos a la orden
    const ordenPedidos = pedidosOrdenes
      .filter(po => po.ordenId == orden.id)
      .map(po => {
        const pedido = pedidos.find(p => p.id == po.pedidoId);
        const producto = productos.find(prod => prod.id == pedido.productoId);
        return producto ? { id: pedido.id, nombre: producto.nombre, cantidad: pedido.cantidad, productoId: producto.id } : { id: pedido.id, nombre: 'Producto no encontrado', cantidad: pedido.cantidad, productoId: null };
      });

    orden.pedidos = ordenPedidos;

    // Agregar información del cliente
    const cliente = usuarios.find(c => c.id == orden.clienteId);
    if (cliente) {
      orden.emailCliente = cliente.email;
    } else {
      orden.emailCliente = 'Email no encontrado';
    }

    // Calcular total de insumos y costo total
    const insumosTotales = {};
    ordenPedidos.forEach(pedido => {
      if (pedido.productoId) {
        const insumosProducto = productosInsumos.filter(pi => pi.productoId == pedido.productoId);
        insumosProducto.forEach(insumoProducto => {
          const insumo = insumos.find(i => i.id == insumoProducto.insumoId);
          if (insumo) {
            if (!insumosTotales[insumo.id]) {
              insumosTotales[insumo.id] = {
                nombre: insumo.nombre,
                cantidad: 0,
                precioUnitario: insumo.precio,
                totalCosto: 0
              };
            }
            insumosTotales[insumo.id].cantidad += insumoProducto.cantidad * pedido.cantidad;
          }
        });
      }
    });

    // Calcular costo total de cada insumo
    let costoTotalInsumos = 0;
    for (const insumoId in insumosTotales) {
      const insumoTotal = insumosTotales[insumoId];
      const unidadesNecesarias = Math.ceil(insumoTotal.cantidad); // Redondear hacia arriba
      insumoTotal.totalCosto = unidadesNecesarias * insumoTotal.precioUnitario;
      costoTotalInsumos += insumoTotal.totalCosto; // Sumar el costo total de cada insumo
    }

    orden.insumosTotales = Object.values(insumosTotales);
    orden.costoTotalInsumos = costoTotalInsumos; // Agregar el costo total de los insumos a la orden

    res.json(orden);
  } else {
    res.status(404).json({ message: 'Orden no encontrada' });
  }
};


exports.updateEstadoOrden = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const ordenIndex = ordenes.findIndex(o => o.id == id);
  if (ordenIndex !== -1) {
    ordenes[ordenIndex].estado = estado;
    res.json(ordenes[ordenIndex]);
  } else {
    res.status(404).json({ message: 'Orden no encontrada' });
  }
}

exports.asignarPanadero = (req, res) => {
  const { id } = req.params;
  const { panadero } = req.body;
  const ordenIndex = ordenes.findIndex(o => o.id == id);
  if (ordenIndex !== -1) {
    ordenes[ordenIndex].panaderoId = panadero;
    ordenes[ordenIndex].estado = 'EN PREPARACION';
    res.json(ordenes[ordenIndex]);
  } else {
    res.status(404).json({ message: 'Orden no encontrada' });
  }
}

exports.darPanaderos = (req, res) => {
  const panaderos = usuarios.filter(u => u.role == 'PANADERO');
  res.json(panaderos);
};

exports.getInsumosPendientes = (req, res) => {
  const ordenesPendientes = ordenes.filter(o => o.estado === 'PENDIENTE');

  if (ordenesPendientes.length > 0) {
    const insumosTotales = {};

    ordenesPendientes.forEach(orden => {
      const ordenPedidos = pedidosOrdenes
        .filter(po => po.ordenId == orden.id)
        .map(po => {
          const pedido = pedidos.find(p => p.id == po.pedidoId);
          const producto = productos.find(prod => prod.id == pedido.productoId);
          return producto ? { id: pedido.id, nombre: producto.nombre, cantidad: pedido.cantidad, productoId: producto.id } : { id: pedido.id, nombre: 'Producto no encontrado', cantidad: pedido.cantidad, productoId: null };
        });

      ordenPedidos.forEach(pedido => {
        if (pedido.productoId) {
          const insumosProducto = productosInsumos.filter(pi => pi.productoId == pedido.productoId);
          insumosProducto.forEach(insumoProducto => {
            const insumo = insumos.find(i => i.id == insumoProducto.insumoId);
            if (insumo) {
              if (!insumosTotales[insumo.id]) {
                insumosTotales[insumo.id] = {
                  nombre: insumo.nombre,
                  cantidad: 0,
                  precioUnitario: insumo.precio,
                  totalCosto: 0
                };
              }
              insumosTotales[insumo.id].cantidad += insumoProducto.cantidad * pedido.cantidad;
            }
          });
        }
      });
    });

    let costoTotalInsumos = 0;
    for (const insumoId in insumosTotales) {
      const insumoTotal = insumosTotales[insumoId];
      const unidadesNecesarias = Math.ceil(insumoTotal.cantidad);
      insumoTotal.totalCosto = unidadesNecesarias * insumoTotal.precioUnitario;
      costoTotalInsumos += insumoTotal.totalCosto;
    }

    res.json({ insumosTotales: Object.values(insumosTotales), costoTotalInsumos });
  } else {
    res.status(404).json({ message: 'No se encontraron órdenes pendientes' });
  }
};