const express = require('express');
const router = express.Router();
const panaderiasController = require('../controllers/panaderiasController');
const { verifyToken, isAdmin, isUser } = require('../middleware/auth');

router.get('/', verifyToken, isUser, (req, res) => {
  /* #swagger.summary = 'Obtiene la lista de panaderías' verifyToken, isUser, */
  /* #swagger.tags = ['Panaderías'] */
  panaderiasController.getPanaderias(req, res);
});

router.get('/:id', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Obtiene una panadería por ID'  verifyToken, isAdmin, */
  /* #swagger.tags = ['Panaderías'] */
  /* #swagger.parameters['id'] = { description: 'ID de la panadería', type: 'integer', required: true } */
  panaderiasController.getPanaderiaById(req, res);
});

router.post('/', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Agrega una nueva panadería' verifyToken, isAdmin,  */
  /* #swagger.tags = ['Panaderías'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new bakery.',
        schema: { $ref: '#/definitions/Producto' }
    } */
  panaderiasController.createPanaderia(req, res);
});

router.put('/:id', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Actualiza una panadería existente' verifyToken, isAdmin,  */
  /* #swagger.tags = ['Panaderías'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'ID de la panadería', type: 'integer', required: true } */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Update bakery.',
        schema: { $ref: '#/definitions/Producto' }
    } */
  panaderiasController.updatePanaderia(req, res);
});

router.delete('/:id', verifyToken, isAdmin, (req, res) => {
  /* #swagger.summary = 'Elimina una panadería'  verifyToken, isAdmin,  */
  /* #swagger.tags = ['Panaderías'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['id'] = { description: 'ID de la panadería', type: 'integer', required: true } */
  panaderiasController.deletePanaderia(req, res);
});

module.exports = router;
