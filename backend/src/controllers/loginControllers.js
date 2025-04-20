const User = require('../models/user');
const Pet = require('../models/pets');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Import pet-related constants from petsControllers
const petTypes = ['Dog', 'Cat', 'Dragon', 'Bird', 'Rabbit', 'Fox'];
const petColors = ['Brown', 'Black', 'White', 'Golden', 'Gray', 'Spotted'];
const rarities = ['Common'];

// Helper functions
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomStat(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
        
        // Check if user has any pets
        const pets = await Pet.find({ owner: user._id });
        let newPet = null;
        
        // If no pets, create a starter pet
        if (pets.length === 0) {
            newPet = new Pet({
                owner: user._id,
                name: `Starter${Math.floor(Math.random() * 10000)}`,
                type: getRandom(petTypes),
                color: getRandom(petColors),
                age: getRandomStat(1, 5),
                level: 1, // Starter pet starts at level 1
                strength: getRandomStat(10, 30),
                agility: getRandomStat(10, 30),
                intelligence: getRandomStat(10, 30),
                rarity: rarities[0], // Common rarity for starter pet
                specialAbility: 'None' // No special ability for starter pet
            });
            await newPet.save();
        }
        
        const payload = { id: user._id, username: user.username, email: user.email };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        
        res.json({ 
            token, 
            user: payload,
            newUserPet: newPet, // Include the new pet in the response if one was created
            firstLogin: pets.length === 0 // Flag to indicate if this was first login
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err.message });
    }
};