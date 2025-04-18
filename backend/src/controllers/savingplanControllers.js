const SavingPlan = require('../models/savingplan');
const Pet = require('../models/pets');

// Define missing arrays and functions
const petTypes = ['Dog', 'Cat', 'Dragon', 'Unicorn', 'Turtle', 'Rabbit', 'Fox', 'Owl'];
const petColors = ['Red', 'Blue', 'Green', 'Purple', 'Gold', 'Silver', 'Black', 'White', 'Rainbow'];
const abilities = ['Healing', 'Fortune', 'Protection', 'Wisdom', 'Strength', 'Speed', 'Luck', 'Magic'];

// Helper functions that were missing
function getRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getRandomStat(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateRandomPet(userId, goalAmount, duration) {
    const difficulty = goalAmount / duration;
    let rarity, strengthRange;

    if (difficulty < 1000) {
        rarity = 'Legendary';
        strengthRange = [80, 100];
    } else if (difficulty < 5000) {
        rarity = 'Epic';
        strengthRange = [60, 80];
    } else if (difficulty < 10000) {
        rarity = 'Rare';
        strengthRange = [40, 60];
    } else if (difficulty < 20000) {
        rarity = 'Uncommon';
        strengthRange = [20, 40];
    } else {
        rarity = 'Common';
        strengthRange = [1, 20];
    }

    const pet = new Pet({
        owner: userId,
        name: `Pet${Math.floor(Math.random() * 10000)}`,
        type: getRandom(petTypes),
        color: getRandom(petColors),
        age: getRandomStat(1, 15),
        level: getRandomStat(1, 10),
        strength: getRandomStat(strengthRange[0], strengthRange[1]),
        agility: getRandomStat(strengthRange[0], strengthRange[1]),
        intelligence: getRandomStat(strengthRange[0], strengthRange[1]),
        rarity: rarity,
        specialAbility: getRandom(abilities)
    });
    await pet.save();
    return pet;
}

// /savingplan/create
exports.createSavingPlan = async (req, res) => {
    try {
        const { goalAmount, duration } = req.body;
        const userId = req.user.id;

        // Check if the user has an active (incomplete) saving plan
        const activePlan = await SavingPlan.findOne({ user: userId, isCompleted: false });
        if (activePlan) {
            return res.status(400).json({ message: 'You already have an active saving plan. Complete it before creating a new one.' });
        }

        // Generate a random pet for the saving plan
        const petReward = await generateRandomPet(userId, goalAmount, duration);

        // Create the saving plan
        const savingPlan = new SavingPlan({
            user: userId,
            goalAmount,
            duration,
            currentlySaved: 0,
            isCompleted: false,
            petReward: petReward._id
        });

        await savingPlan.save();
        res.status(201).json({ message: 'Saving plan created', savingPlan });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// /savingplan/update
exports.updateSavingPlan = async (req, res) => {
    try {
        const { savingPlanId, amount } = req.body;
        const userId = req.user.id;

        console.log('Request Body:', req.body);

        if (!savingPlanId || !amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid savingPlanId or amount.' });
        }

        const savingPlan = await SavingPlan.findOne({ _id: savingPlanId, user: userId }).populate('petReward');
        console.log('Saving Plan:', savingPlan);

        if (!savingPlan) {
            return res.status(404).json({ message: 'Saving plan not found.' });
        }

        if (savingPlan.isCompleted) {
            return res.status(400).json({ message: 'Saving plan is already completed.' });
        }

        console.log('Currently Saved Before:', savingPlan.currentlySaved);
        savingPlan.currentlySaved += amount;
        console.log('Currently Saved After:', savingPlan.currentlySaved);

        if (savingPlan.currentlySaved >= savingPlan.goalAmount) {
            savingPlan.isCompleted = true;
            savingPlan.currentlySaved = savingPlan.goalAmount; // Cap the saved amount
            savingPlan.petReward.owner = userId; // Assign the pet to the user
            await savingPlan.petReward.save();
        }

        await savingPlan.save();
        console.log('Saving Plan Updated:', savingPlan);

        res.status(200).json({ message: 'Saving plan updated', savingPlan });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(400).json({ error: err.message });
    }
};
// /savingplan
// /savingplan
exports.getUserSavingPlans = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find saving plans for the user that are not yet completed
        const savingPlans = await SavingPlan.find({ user: userId, isCompleted: false }).populate('petReward');

        res.json(savingPlans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};