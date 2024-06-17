let insumos = [
    { id: 1, nombre: 'Insumo 1', descripcion: 'Descripción 1', imagen: 'data:image/jpeg;base64,/9j/...', precio: 10.0, stock: 2},
    { id: 2, nombre: 'Insumo 2', descripcion: 'Descripción 2', imagen: 'data:image/jpeg;base64,/9j/...', precio: 20.0, stock:10 }
  ];
  
  exports.insumos = insumos;

  exports.getInsumos = (req, res) => {
    res.json(insumos);
  };
  
  exports.getInsumoById = (req, res) => {
    const { id } = req.params;
    const insumo = insumos.find(p => p.id == id);
    if (insumo) {
      res.json(insumo);
    } else {
      res.status(404).json({ message: 'insumo no encontrado' });
    }
  };
  
  exports.createInsumo = (req, res) => {
    const newInsumo = req.body;
    newInsumo.id = insumos.length ? insumos[insumos.length - 1].id + 1 : 1;
    insumos.push(newInsumo);
    res.status(201).json(newInsumo);
  };
  
  exports.updateInsumo = (req, res) => {
    const { id } = req.params;
    const updatedInsumo = req.body;
    const InsumoIndex = insumos.findIndex(p => p.id == id);
    if (InsumoIndex !== -1) {
      insumos[InsumoIndex] = { ...insumos[InsumoIndex], ...updatedInsumo };
      res.json(insumos[InsumoIndex]);
    } else {
      res.status(404).json({ message: 'insumo no encontrado' });
    }
  };
  
  exports.deleteInsumo = (req, res) => {
    const { id } = req.params;
    const InsumoIndex = insumos.findIndex(p => p.id == id);
    if (InsumoIndex !== -1) {
      const deletedInsumo = insumos.splice(InsumoIndex, 1);
      res.json(deletedInsumo);
    } else {
      res.status(404).json({ message: 'insumo no encontrado' });
    }
  };
  