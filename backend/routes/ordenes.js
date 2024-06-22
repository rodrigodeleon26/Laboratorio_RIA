const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenesController');
const { verifyToken, isAdmin, isUser, isPanadero } = require('../middleware/auth');

router.get('/', verifyToken, isUser, (req, res) => {
  /* #swagger.summary = 'Obtiene la lista de órdenes' verifyToken, isUser, */
  /* #swagger.tags = ['Órdenes'] */
  ordenesController.getOrdenes(req, res);
});

//todos los datos procesados segun la id de la orden
router.get('/getInfoOrden/:id', verifyToken, isUser, (req, res) => {
  /* #swagger.summary = 'Obtiene la información de una orden' verifyToken, isAdmin, */
  /* #swagger.tags = ['Órdenes'] */
  /* #swagger.parameters['id'] = { description: 'ID de la orden', type: 'integer', required: true } */
  ordenesController.getInfoOrden(req, res);
});

//entrega nombre e id de usuarios que han hecho ordenes
router.get('/getUsuarios', verifyToken, isUser, (req, res) => {
  /* #swagger.summary = 'Obtiene los usuarios que han hecho órdenes' verifyToken, isAdmin, */
  /* #swagger.tags = ['Órdenes'] */
  ordenesController.getUsuariosOrdenes(req, res);
});

router.get('/getPanaderos', verifyToken, isUser, (req, res) => {
  /* #swagger.summary = 'Obtiene los panaderos disponibles' verifyToken, isAdmin, */
  /* #swagger.tags = ['Órdenes'] */
  ordenesController.darPanaderos(req, res);
});

router.get('/:id', verifyToken, isUser, (req, res) => {
  /* #swagger.summary = 'Obtiene una orden por ID'  verifyToken, isAdmin, */
  /* #swagger.tags = ['Órdenes'] */
  /* #swagger.parameters['id'] = { description: 'ID de la orden', type: 'integer', required: true } */
  ordenesController.getOrdenById(req, res);
});

router.post('/actualizarEstado/:id', verifyToken, isPanadero, (req, res) => {
  /* #swagger.summary = 'Actualiza el estado de una orden' verifyToken, isAdmin, */
  /* #swagger.tags = ['Órdenes'] */
  /* #swagger.parameters['id'] = { description: 'ID de la orden', type: 'integer', required: true } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update order state.',
        schema: { $ref: '#/definitions/Orden' }
    } */
  ordenesController.updateEstadoOrden(req, res);
});

router.post('/asignarPanadero/:id', verifyToken, isPanadero, (req, res) => {
  /* #swagger.summary = 'Asigna un panadero a una orden' verifyToken, isAdmin, */
  /* #swagger.tags = ['Órdenes'] */
  /* #swagger.parameters['id'] = { description: 'ID de la orden', type: 'integer', required: true } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Assign baker to order.',
        schema: { $ref: '#/definitions/Orden' }
    } */
  ordenesController.asignarPanadero(req, res);
});

router.post('/', verifyToken, isUser, (req, res) => {
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

router.put('/:id', verifyToken, isPanadero, (req, res) => {
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

router.delete('/:id', verifyToken, isUser, (req, res) => {
  /* #swagger.summary = 'Elimina una orden'  verifyToken, isAdmin,  */
  /* #swagger.tags = ['Órdenes'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'ID de la orden', type: 'integer', required: true } */
  ordenesController.deleteOrden(req, res);
});

//obtener ordenes por usuario
router.get('/usuario/:id', verifyToken, isUser, (req, res) => {
  /* #swagger.summary = 'Obtiene las órdenes de un usuario' verifyToken, isUser, */
  /* #swagger.tags = ['Órdenes'] */
  /* #swagger.parameters['id'] = { description: 'ID del usuario', type: 'integer', required: true } */
  ordenesController.getOrdenesByUsuario(req, res);
});


module.exports = router;
