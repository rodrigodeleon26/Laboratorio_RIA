const express = require('express');
const router = express.Router();
const insumosController = require('../controllers/insumosController');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');

router.get('/', (req, res) => {
  /* #swagger.summary = 'Obtiene la lista de insumos' verifyToken, isUser, */
  /* #swagger.tags = ['Insumos'] */
  insumosController.getInsumos(req, res);
});

router.get('/:id', (req, res) => {
  /* #swagger.summary = 'Obtiene un insumo por ID' verifyToken, isAdmin, */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.parameters['id'] = { description: 'ID del insumo', type: 'integer', required: true } */
  insumosController.getInsumoById(req, res);
});

router.post('/', (req, res) => {
  /* #swagger.summary = 'Agrega un nuevo insumo' verifyToken, isAdmin,  */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new input.',
        schema: { $ref: '#/definitions/Insumo' }
    } */
  insumosController.createInsumo(req, res);
});

router.put('/:id', (req, res) => {
  /* #swagger.summary = 'Actualiza un insumo existente' verifyToken, isAdmin,  */
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

router.delete('/:id', (req, res) => {
  /* #swagger.summary = 'Elimina un insumo'  verifyToken, isAdmin,  */
  /* #swagger.tags = ['Insumos'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'ID del insumo', type: 'integer', required: true } */
  insumosController.deleteInsumo(req, res);
});

module.exports = router;
