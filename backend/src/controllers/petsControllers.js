const Pet = require('../models/pets');

const petTypes = ['Dog', 'Cat', 'Dragon', 'Bird', 'Rabbit', 'Fox'];
const petColors = ['Brown', 'Black', 'White', 'Golden', 'Gray', 'Spotted'];
const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
const abilities = ['Fire Breath', 'Invisibility', 'Super Speed', 'Healing', 'Flight', 'Telepathy', 'None'];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomStat(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// pets/create
exports.createRandomPet = async (req, res) => {
    try {
        const userId = req.user.id;
        const pet = new Pet({
            owner: userId,
            name: `Pet${Math.floor(Math.random() * 10000)}`,
            type: getRandom(petTypes),
            color: getRandom(petColors),
            age: getRandomStat(1, 15),
            level: getRandomStat(1, 10),
            strength: getRandomStat(1, 100),
            agility: getRandomStat(1, 100),
            intelligence: getRandomStat(1, 100),
            rarity: getRandom(rarities),
            specialAbility: getRandom(abilities)
        });
        await pet.save();
        res.status(201).json({ message: 'Pet created', pet });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// //pets
exports.getUserPets = async (req, res) => {
    try {
        const userId = req.user.id;
        const pets = await Pet.find({ owner: userId });
        res.json(pets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.giftPet = async (req, res) => {
    try {
        const { petId, toUserId } = req.params;
        const fromUserId = req.user.id;
        
        // Verify pet exists and belongs to current user
        const pet = await Pet.findOne({ _id: petId, owner: fromUserId });
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found or you do not own this pet' });
        }
        
        // Verify recipient user exists
        const User = mongoose.model('User');
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).json({ error: 'Recipient user not found' });
        }
        
        // Transfer ownership
        pet.owner = toUserId;
        await pet.save();
        
        res.status(200).json({ 
            message: `Pet ${pet.name} successfully gifted to ${toUser.username}`,
            pet
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// /pets/all

// Get pets of all users
exports.getAllUsersPets = async (req, res) => {
    try {
        const pets = await Pet.find().populate('owner', 'username email'); // Populate owner details (username and email)
        res.json(pets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};