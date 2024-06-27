const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', (req, res) => {
  /* #swagger.summary = 'Registra un nuevo usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Registro de nuevo usuario.',
        schema: { $ref: '#/definitions/RegisterUser' }
    } */
  usuariosController.register(req, res);
});

router.post('/login', (req, res) => {
  /* #swagger.summary = 'Inicia sesión' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Credenciales de usuario.',
        schema: { $ref: '#/definitions/Login' }
    } */
  usuariosController.login(req, res);
});

router.post('/change-password', (req, res) => {
  /* #swagger.summary = 'Cambia la contraseña del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Cambio de contraseña de usuario.',
        schema: { $ref: '#/definitions/ChangePassword' }
    } */
  usuariosController.changePassword(req, res);
});

router.post('/forgot-password', (req, res) => {
  /* #swagger.summary = 'Recupera la contraseña olvidada' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Recuperación de contraseña de usuario.',
        schema: { $ref: '#/definitions/ForgotPassword' }
    } */
  usuariosController.forgotPassword(req, res);
});

router.post('/reset-password', (req, res) => {
  /* #swagger.summary = 'Restablece la contraseña de un usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Restablecimiento de contraseña de usuario.',
        schema: { $ref: '#/definitions/ResetPassword' }
    } */
  usuariosController.resetPassword(req, res);
});

router.post('/enable-user', (req, res) => {
  /* #swagger.summary = 'Habilita un usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Habilitación de usuario.',
        schema: { $ref: '#/definitions/EnableDisableUser' }
    } */
  usuariosController.enableUser(req, res);
});

router.post('/disable-user', (req, res) => {
  /* #swagger.summary = 'Deshabilita un usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Deshabilitación de usuario.',
        schema: { $ref: '#/definitions/EnableDisableUser' }
    } */
  usuariosController.disableUser(req, res);
});

router.post('/update', (req, res) => {
  /* #swagger.summary = 'Actualiza un usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Actualización de usuario.',
        schema: { $ref: '#/definitions/UpdateUser' }
    } */
  usuariosController.update(req, res);
});

router.get('/getInfo', verifyToken, (req, res) => { 
  /* #swagger.summary = 'Obtiene la información del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  usuariosController.getInfo(req, res);
});

router.get('/getId', verifyToken, (req, res) => {
  /* #swagger.summary = 'Obtiene el ID del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  usuariosController.getId(req, res);
});

router.get('/getEmail', verifyToken, (req, res) => {
  /* #swagger.summary = 'Obtiene el correo del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  usuariosController.getEmail(req, res);
});

router.get('/getRole', verifyToken, (req, res) => {
  /* #swagger.summary = 'Obtiene el rol del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  usuariosController.getRole(req, res);
});

router.get('/getTelefono', verifyToken, (req, res) => {
  /* #swagger.summary = 'Obtiene el teléfono del usuario' */
  /* #swagger.tags = ['Usuarios'] */
  /* #swagger.security = [{ "BearerAuth": [] }] */
  usuariosController.getTelefono(req, res);
});

module.exports = router;
