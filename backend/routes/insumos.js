const express = require('express');
const router = express.Router();
const insumosController = require('../controllers/insumosController');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');

router.get('/', (req, res) => {
  /* #swagger.summary = 'Obtiene la lista de productos' verifyToken, isUser, */
  /* #swagger.tags = ['Productos'] */
  insumosController.getInsumos(req, res);
});

router.get('/:id', (req, res) => {
  /* #swagger.summary = 'Obtiene un producto por ID'  verifyToken, isAdmin, */
  /* #swagger.tags = ['Productos'] */
  /* #swagger.parameters['id'] = { description: 'ID del producto', type: 'integer', required: true } */
  insumosController.getInsumoById(req, res);
});

router.post('/', (req, res) => {
  /* #swagger.summary = 'Agrega un nuevo producto' verifyToken, isAdmin,  */
  /* #swagger.tags = ['Productos'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new product.',
        schema: { $ref: '#/definitions/Producto' }
    } */
  insumosController.createInsumo(req, res);
});

router.put('/:id', (req, res) => {
  /* #swagger.summary = 'Actualiza un producto existente' verifyToken, isAdmin,  */
  /* #swagger.tags = ['Productos'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'ID del producto', type: 'integer', required: true } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update product.',
        schema: { $ref: '#/definitions/Producto' }
    } */
  insumosController.updateInsumo(req, res);
});

router.delete('/:id', (req, res) => {
  /* #swagger.summary = 'Elimina un producto'  verifyToken, isAdmin,  */
  /* #swagger.tags = ['Productos'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'ID del producto', type: 'integer', required: true } */
  insumosController.deleteInsumo(req, res);
});

module.exports = router;
