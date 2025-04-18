const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return { valid: true, decoded };
    } catch (err) {
        return { valid: false, error: err.message };
    }
}

module.exports = {
    verifyToken
};