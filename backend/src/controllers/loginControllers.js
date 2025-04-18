const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const payload = { id: user._id, username: user.username, email: user.email };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: payload });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};