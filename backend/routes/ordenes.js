const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenesController');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');

router.get('/', (req, res) => {
  /* #swagger.summary = 'Obtiene la lista de órdenes' verifyToken, isUser, */
  /* #swagger.tags = ['Órdenes'] */
  ordenesController.getOrdenes(req, res);
});

router.get('/:id', (req, res) => {
  /* #swagger.summary = 'Obtiene una orden por ID'  verifyToken, isAdmin, */
  /* #swagger.tags = ['Órdenes'] */
  /* #swagger.parameters['id'] = { description: 'ID de la orden', type: 'integer', required: true } */
  ordenesController.getOrdenById(req, res);
});

router.post('/', (req, res) => {
  /* #swagger.summary = 'Agrega una nueva orden' verifyToken, isAdmin,  */
  /* #swagger.tags = ['Órdenes'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new order.',
        schema: { $ref: '#/definitions/Orden' }
    } */
  ordenesController.createOrden(req, res);
});

router.put('/:id', (req, res) => {
  /* #swagger.summary = 'Actualiza una orden existente' verifyToken, isAdmin,  */
  /* #swagger.tags = ['Órdenes'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'ID de la orden', type: 'integer', required: true } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update order.',
        schema: { $ref: '#/definitions/Orden' }
    } */
  ordenesController.updateOrden(req, res);
});

router.delete('/:id', (req, res) => {
  /* #swagger.summary = 'Elimina una orden'  verifyToken, isAdmin,  */
  /* #swagger.tags = ['Órdenes'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'ID de la orden', type: 'integer', required: true } */
  ordenesController.deleteOrden(req, res);
});

module.exports = router;
