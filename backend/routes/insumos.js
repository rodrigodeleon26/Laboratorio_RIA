const express = require('express');
const router = express.Router();
const insumosController = require('../controllers/insumosController');
const { verifyToken, isAdmin, isPanadero } = require('../middleware/auth');

router.get('/', verifyToken, isPanadero, (req, res) => {
  //verifyToken, isAdmin, 
  /* #swagger.summary = 'Obtiene la lista de insumos' */
  /* #swagger.tags = ['Insumos'] */
  insumosController.getInsumos(req, res);
});

router.get('/:id', verifyToken, isPanadero, (req, res) => {
  //verifyToken, isAdmin, 
  /* #swagger.summary = 'Obtiene un insumo por ID' */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.parameters['id'] = { description: 'ID del insumo', type: 'integer', required: true } */
  insumosController.getInsumoById(req, res);
});

router.post('/', verifyToken, isAdmin, (req, res) => {
  //verifyToken, isAdmin, 
  /* #swagger.summary = 'Agrega un nuevo insumo' */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new input.',
        schema: { $ref: '#/definitions/Insumo' }
    } */
  insumosController.createInsumo(req, res);
});

router.put('/:id', verifyToken, isAdmin, (req, res) => {
  //verifyToken, isAdmin, 
  /* #swagger.summary = 'Actualiza un insumo existente' */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'ID del insumo', type: 'integer', required: true } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update input.',
        schema: { $ref: '#/definitions/Insumo' }
    } */
  insumosController.updateInsumo(req, res);
});

router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  //verifyToken, isAdmin, 
  /* #swagger.summary = 'Elimina un insumo' */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'ID del insumo', type: 'integer', required: true } */
  insumosController.deleteInsumo(req, res);
});

module.exports = router;
