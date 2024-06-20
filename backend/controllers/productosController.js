  const { productos, insumos, productosInsumos } = require('../mockData');
  
  exports.getProductos = (req, res) => {
    res.json(productos);
  };
  
  exports.getProductoById = (req, res) => {
    const { id } = req.params;
    const producto = productos.find(p => p.id == id);
    if (producto) {
      let InsumosProducto = productosInsumos.filter(pi => pi.productoId == id);
      InsumosProducto = InsumosProducto.map(pi => {
        const insumo = insumos.find(i => i.id == pi.insumoId);
        return { ...pi, insumo };
      });
      producto.insumos = InsumosProducto;

      res.json(producto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  };
  
  /*exports.createProducto = (req, res) => {
    const newProducto = req.body;
    newProducto.id = productos.length ? productos[productos.length - 1].id + 1 : 1;
    productos.push(newProducto);
    res.status(201).json(newProducto);
  };*/

  exports.createProducto = (req, res) => {
    const newProducto = req.body.producto;
    const insumosProducto = req.body.insumosProducto;

    if (!newProducto || !insumosProducto) {
      return res.status(400).json({ message: 'Invalid request body' });
    }
    
    newProducto.id = productos.length ? productos[productos.length - 1].id + 1 : 1;
    productos.push(newProducto);
  
    insumosProducto.forEach(insumosProducto => {
      productosInsumos.push({
        productoId: newProducto.id,
        insumoId: insumosProducto.insumoId,
        cantidad: insumosProducto.cantidad
      });
    });
    
    res.status(201).json(newProducto);
  };
  
  exports.updateProductoINSUMO = (req, res) => {
    const updatedProducto = req.body.producto;
    const insumosProducto = req.body.insumosProducto;
    console.log('insumosProducto', insumosProducto);
    const { id } = req.params;

    const productoIndex = productos.findIndex(p => p.id == id);
    if (productoIndex !== -1) {
      productos[productoIndex] = { ...productos[productoIndex], ...updatedProducto };
      res.json(productos[productoIndex]);

      //actualizar eliminar o agregar Insumos producto segun sea necesario
      insumosProducto.forEach(insumoProducto => {
        const productoInsumoIndex = productosInsumos.findIndex(pi => pi.productoId == id && pi.insumoId == insumoProducto.insumoId);
        if (productoInsumoIndex !== -1) {
          productosInsumos[productoInsumoIndex].cantidad = insumoProducto.cantidad;
        } else {
          productosInsumos.push({
            productoId: id,
            insumoId: insumoProducto.insumoId,
            cantidad: insumoProducto.cantidad
          });
        }
      });

      const productoInsumos = productosInsumos.filter(pi => pi.productoId == id);
      productoInsumos.forEach(pi => {
        const insumoIndex = insumosProducto.findIndex(i => i.insumoId == pi.insumoId);
        /*if (insumoIndex !== -1) {
          console.log('insumoIndex', insumoIndex);
          console.log('pi', pi);
          pi.cantidad = insumosProducto[insumoIndex].cantidad;
        }*/
        if (insumoIndex === -1) {
          console.log('insumoIndex', insumoIndex);
          console.log('pi', pi);
          //si el insumo no esta en la lista de insumosProducto, se elimina
          const piIndex = productosInsumos.findIndex(i => i.productoId == id && i.insumoId == pi.insumoId);
          console.log('piIndex', piIndex);
          console.log("productosInsumos", productosInsumos);
          productosInsumos.splice(piIndex, 1);
        }
      });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  };

  // exports.updateProducto = (req, res) => {
  //   const { id } = req.params;
  //   const updatedProducto = req.body;
  //   const productoIndex = productos.findIndex(p => p.id == id);
  //   if (productoIndex !== -1) {
  //     productos[productoIndex] = { ...productos[productoIndex], ...updatedProducto };
  //     res.json(productos[productoIndex]);
  //   } else {
  //     res.status(404).json({ message: 'Producto no encontrado' });
  //   }
  // };
  
  exports.deleteProducto = (req, res) => {
    const { id } = req.params;
    const productoIndex = productos.findIndex(p => p.id == id);
    if (productoIndex !== -1) {
      const deletedProducto = productos.splice(productoIndex, 1);
      res.json(deletedProducto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  };

  //devuelve los productoInsumos segun la id del producto
  /*const productosInsumos = [
    { productoId: 1, insumoId: 1, cantidad: 10 },
    { productoId: 1, insumoId: 2, cantidad: 20 },
    { productoId: 2, insumoId: 1, cantidad: 5 },
];*/
  exports.getProductoInsumos = (req, res) => {
    const { id } = req.params;
    const productoInsumos = productosInsumos.filter(pi => pi.productoId == id);
    if (productoInsumos.length) {
      //const insumosProducto = insumos.filter(i => productoInsumos.some(pi => pi.insumoId == i.id));
      res.json(productoInsumos);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  }


  /*exports.getProductoInsumos = (req, res) => {
    const { id } = req.params;
    const productoInsumos = productosInsumos.filter(pi => pi.productoId == id);
    if (productoInsumos.length) {
      const insumosProducto = insumos.filter(i => productoInsumos.some(pi => pi.insumoId == i.id));
      res.json(insumosProducto);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  };*/

  
  