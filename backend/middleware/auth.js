const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.userRole !== 'ADMIN') {
        return res.status(403).json({ message: 'Requires Admin Role' });
    }
    next();
};

const isPanadero = (req, res, next) => {
    if (req.userRole !== 'PANADERO' && req.userRole !== 'ADMIN') {
        return res.status(403).json({ message: 'Requires Panadero Role' });
    }
    next();
};

const isUser = (req, res, next) => {
    if (req.userRole !== 'ADMIN' && req.userRole !== 'PANADERO' && req.userRole !== 'USER') {
        return res.status(403).json({ message: 'Requires User Role' });
    }
    next();
};

module.exports = {
    verifyToken,
    isAdmin,
    isPanadero,
    isUser
};
