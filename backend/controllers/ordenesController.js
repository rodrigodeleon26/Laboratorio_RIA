  const {ordenes, usuarios, productos} = require('../mockData');

  exports.ordenes = ordenes;
  
  exports.getOrdenes = (req, res) => {
    res.json(ordenes);
  };
  
  exports.getOrdenById = (req, res) => {
    const { id } = req.params;
    const orden = ordenes.find(p => p.id == id);
    if (orden) {
      res.json(orden);
    } else {
      res.status(404).json({ message: 'Orden no encontrado' });
    }
  };
  
  exports.createOrden = (req, res) => {
    const newOrden = req.body;
    newOrden.id = ordenes.length ? ordenes[ordenes.length - 1].id + 1 : 1;
    ordenes.push(newOrden);
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
      res.status(404).json({ message: 'Orden no encontrado' });
    }
  };
  
  exports.deleteOrden = (req, res) => {
    const { id } = req.params;
    const ordenIndex = ordenes.findIndex(p => p.id == id);
    if (ordenIndex !== -1) {
      const deletedOrden = ordenes.splice(ordenIndex, 1);
      res.json(deletedOrden);
    } else {
      res.status(404).json({ message: 'Orden no encontrado' });
    }
  };

  //devuelve los productos de una orden
  exports.getProductosOrden = (req, res) => {
    const { id } = req.params;
    const orden = ordenes.find(p => p.id == id);
    if (orden) {
      const productosOrden = orden.productos.map(id => productos.find(p => p.id == id));
      res.json(productosOrden);
    } else {
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  };