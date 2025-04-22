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

// pets/pve/:petId
exports.petVsEnvironment = async (req, res) => {
    try {
        const { petId } = req.params;
        const pet = await Pet.findById(petId);

        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Generate a random enemy
        const enemy = {
            name: `Enemy${Math.floor(Math.random() * 1000)}`,
            level: getRandomStat(1, 10),
            strength: getRandomStat(1, 10),
            agility: getRandomStat(1, 10),
            intelligence: getRandomStat(1, 10),
        };

        // Simulate battle
        let petHealth = 100;
        let enemyHealth = 100;

        while (petHealth > 0 && enemyHealth > 0) {
            // Pet attacks enemy
            const petDamage = Math.floor((pet.strength + pet.agility) / 2);
            enemyHealth -= petDamage;

            // Enemy attacks pet
            const enemyDamage = Math.floor((enemy.strength + enemy.agility) / 2);
            petHealth -= enemyDamage;
        }

        const result = petHealth > 0 ? 'win' : 'lose';
        res.json({
            message: `Battle finished! Your pet ${result}s.`,
            petHealth: Math.max(petHealth, 0),
            enemyHealth: Math.max(enemyHealth, 0),
            enemy,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// pets/pvp/:petId1/:petId2
exports.petVsPet = async (req, res) => {
    try {
        const { petId1, petId2 } = req.params;

        const pet1 = await Pet.findById(petId1);
        const pet2 = await Pet.findById(petId2);

        if (!pet1 || !pet2) {
            return res.status(404).json({ error: 'One or both pets not found' });
        }

        // Simulate battle
        let pet1Health = 100;
        let pet2Health = 100;

        while (pet1Health > 0 && pet2Health > 0) {
            // Pet 1 attacks Pet 2
            const pet1Damage = Math.floor((pet1.strength + pet1.agility) / 2);
            pet2Health -= pet1Damage;

            // Pet 2 attacks Pet 1
            const pet2Damage = Math.floor((pet2.strength + pet2.agility) / 2);
            pet1Health -= pet2Damage;
        }

        const winner = pet1Health > 0 ? pet1 : pet2;
        const loser = pet1Health > 0 ? pet2 : pet1;

        res.json({
            message: `Battle finished! ${winner.name} wins.`,
            winner: {
                name: winner.name,
                remainingHealth: Math.max(pet1Health, pet2Health),
            },
            loser: {
                name: loser.name,
                remainingHealth: 0,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};