let panaderias = [
    { id: 1, nombre: 'Don Francisco'},
    { id: 2, nombre: 'Colonial'}
  ];
  
  exports.getPanaderias = (req, res) => {
      res.json(panaderias);
  };
    
  exports.getPanaderiaById = (req, res) => {
      const { id } = req.params;
      const panaderia = panaderias.find(p => p.id == id);
      if (panaderia) {
          res.json(panaderia);
      } else {
          res.status(404).json({ message: 'Panaderia no encontrada' });
      }
  };
    
  exports.createPanaderia = (req, res) => {
      const newPanaderia = req.body;
      newPanaderia.id = panaderias.length ? panaderias[panaderias.length - 1].id + 1 : 1;
      panaderias.push(newPanaderia);
      res.status(201).json(newPanaderia);
  };
    
  exports.updatePanaderia = (req, res) => {
      const { id } = req.params;
      const updatedPanaderia = req.body;
      const panaderiaIndex = panaderias.findIndex(p => p.id == id);
      if (panaderiaIndex !== -1) {
          panaderias[panaderiaIndex] = { ...panaderias[panaderiaIndex], ...updatedPanaderia };
          res.json(panaderias[panaderiaIndex]);
      } else {
          res.status(404).json({ message: 'Panaderia no encontrada' });
      }
  };
    
  exports.deletePanaderia = (req, res) => {
      const { id } = req.params;
      const panaderiaIndex = panaderias.findIndex(p => p.id == id);
      if (panaderiaIndex !== -1) {
          const deletedPanaderia = panaderias.splice(panaderiaIndex, 1);
          res.json(deletedPanaderia);
      } else {
          res.status(404).json({ message: 'Panaderia no encontrada' });
      }
  };
    