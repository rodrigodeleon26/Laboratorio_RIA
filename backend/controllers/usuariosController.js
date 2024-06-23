const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {usuarios} = require('../mockData')
const nodemailer = require('nodemailer');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
};

const generateTokenReset = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, 'your_secret_key', { expiresIn: '10m' });
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true para el puerto 465, false para el otro
  auth: {
    user: 'bakery.houseutec@gmail.com',
    pass: 'mfsl ayna jfig avpa'
  }
});


// Función para crear usuarios por defecto
const createDefaultUsers = async () => {
  const defaultUsers = [
    { email: 'admin@example.com', password: 'admin123', role: 'ADMIN', telefono: '123456789' },
    { email: 'panadero@example.com', password: 'panadero123', role: 'PANADERO', telefono: '987654321' },
    { email: 'panadero2@example.com', password: 'panadero123', role: 'PANADERO', telefono: '123123123'},
    { email: 'user@example.com', password: 'user123', role: 'USER', telefono: '456123789' },
    { email: 'user2@example.com' , password: 'user123', role: 'USER', telefono: '789456123'},
    { email: 'user3@example.com' , password: 'user123', role: 'USER', telefono: '987456321'},
    { email: 'rd6209965@gmail.com', password: '123', role: 'USER', telefono: '123456789'}
  ];

  for (const user of defaultUsers) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      telefono: user.telefono,
      enabled: true,
    };
    usuarios.push(newUser);
  }
};

// Llama a la función para crear usuarios por defecto al inicio
createDefaultUsers();

exports.usuarios = usuarios;

const register = async (req, res) => {
  const { email, password, role, telefono } = req.body;
  const existingUser = usuarios.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'El email ya está en uso. Por favor, utiliza otro email.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: usuarios.length ? usuarios[usuarios.length - 1].id + 1 : 1,
    email,
    password: hashedPassword,
    role: role || 'USER',
    telefono,
    enabled: true,
  };
  usuarios.push(newUser);
  const token = generateToken(newUser); 
  res.status(201).json({ newUser, token }); 
};

const update = async (req, res) => {
  const { email, telefono, id } = req.body;
  console.log(req.body)
  const user = usuarios.find(u => u.id == id);
  if (user) {
    user.email = email;
    user.telefono = telefono;
    res.json({ message: 'User updated' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = usuarios.find(u => u.email === email);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = generateToken(user);
    res.json({ token, nombre: user.email, role: user.role, id: user.id, telefono: user.telefono});
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
};

const changePassword = async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  const user = usuarios.find(u => u.id == id);
  if (user && await bcrypt.compare(oldPassword, user.password)) {
    user.password = await bcrypt.hash(newPassword, 10);
    res.json({ message: 'Password updated' });
  } else {
    res.status(400).json({ message: 'Invalid password' });
  }
};

const forgotPassword = (req, res) => {
  const { email } = req.body;
  const user = usuarios.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  const token = generateTokenReset(user);

  const mailOptions = {
    from: 'bakery.houseutec@gmail.com',
    to: email,
    subject: 'Recuperación de contraseña',
    text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: http://localhost:4200/reset-password?token=${token}`,
    html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p><p><a href="http://localhost:4200/reset-password?token=${token}">Restablecer contraseña</a></p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
    }
    res.json({ message: 'Correo electrónico de recuperación enviado' });
  });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, 'your_secret_key'); 
    const user = usuarios.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    res.json({ message: 'Contraseña restablecida correctamente'});
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};

const enableUser = (req, res) => {
  const { id } = req.body;
  const user = usuarios.find(u => u.id == id);
  if (user) {
    user.enabled = true;
    res.json({ message: 'User enabled' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const disableUser = (req, res) => {
  const { id } = req.body;
  const user = usuarios.find(u => u.id == id);
  if (user) {
    user.enabled = false;
    res.json({ message: 'User disabled' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const getInfoUser = (req, res) => {
  //devuelve datos del usuario excepto la contraseña
  const { id } = req.body;
  const user = usuarios.find(u => u.id == id);
  if (user) {
    res.json({ email: user.email, role: user.role, telefono: user.telefono });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  register,
  update,
  login,
  changePassword,
  forgotPassword,
  enableUser,
  disableUser,
  getInfoUser,
  resetPassword
};
