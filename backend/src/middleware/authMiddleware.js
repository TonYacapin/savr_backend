const { verifyToken } = require('./auth');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const result = verifyToken(token);
    if (!result.valid) {
        return res.status(403).json({ message: 'Invalid token', error: result.error });
    }

    req.user = result.decoded; // Attach decoded payload to request
    next();
}

module.exports = authMiddleware;