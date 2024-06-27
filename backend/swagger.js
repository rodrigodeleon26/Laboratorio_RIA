const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API Documentación',
    description: 'Documentación de la API generada automáticamente',
  },
  host: 'localhost:3000',
  schemes: ['http'],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Ingrese su token en el formato: Bearer <token>'
    }
  },
  definitions: {
    Hospital: {
      id: 1,
      nombre: "Hospital Central",
      direccion: "Av. Principal 123",
    },
    Usuario: {
      id: 1,
      email: "user@example.com",
      password: "password123",
      role: "USER",
      telefono: "123456789",
      enabled: true
    },
    RegisterUser: {
      email: "user@example.com",
      password: "password123",
      role: "USER",
      telefono: "123456789",
    },
    Login: {
      email: "user@example.com",
      password: "password123",
    },
    ChangePassword: {
      id: 1,
      oldPassword: "password123",
      newPassword: "newpassword123",
    },
    ForgotPassword: {
      email: "user@example.com",
    },
    EnableDisableUser: {
      id: 1,
    },
    Producto: {
      id: 1,
      nombre: "Producto Ejemplo",
      descripcion: "Descripción del producto",
      imagen: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      precio: 9.99
    },
    Insumo: {
      id: 1,
      nombre: "Insumo Ejemplo",
      descripcion: "Descripción del insumo",
      imagen: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      precio: 9.99
    },
    Orden: {
      id: 1,
      fecha: '2024-06-18',
      estado: "PENDIENTE",
      importe: 9.99,
      clienteId: 2,
      pedidos: [{ id: 1, productoId: 1, cantidad: 2 },
                { id: 2, productoId: 2, cantidad: 3 }]
    },
    Pedido: {
      id: 1,
      productoId: 1,
      cantidad: 2,
    }
  }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./app'); // Tu archivo principal de la aplicación
});
