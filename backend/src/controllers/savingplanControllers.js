const SavingPlan = require('../models/savingplan');
const Pet = require('../models/pets');
const moment = require('moment');

// Helper functions for pet generation
const petTypes = [
  'Dog', 'Cat', 'Dragon', 'Bird', 'Rabbit', 'Fox', 'Wolf', 'Turtle', 'Lizard', 'Tiger',
  'Lion', 'Bear', 'Unicorn', 'Penguin', 'Frog', 'Dolphin', 'Shark', 'Octopus', 'Deer', 'Bat',
  'Panda', 'Raccoon', 'Koala', 'Hedgehog', 'Chameleon', 'Squirrel', 'Snake', 'Crocodile', 'Horse', 'Elephant',
  'Phoenix', 'Griffin', 'Slime', 'Bee', 'Ant', 'Spider', 'Rat', 'Hamster', 'Giraffe', 'Zebra',
  'Leopard', 'Cheetah', 'Eagle', 'Parrot', 'Seahorse', 'Crab', 'Moose', 'Goat', 'Ox', 'Jellyfish'
];

const petColors = [
  'Brown', 'Black', 'White', 'Golden', 'Gray', 'Spotted', 'Striped', 'Blue', 'Red', 'Green',
  'Purple', 'Pink', 'Orange', 'Silver', 'Cream', 'Lavender', 'Yellow', 'Tan', 'Marbled', 'Rust',
  'Ivory', 'Cyan', 'Teal', 'Mint', 'Sky Blue', 'Charcoal', 'Amber', 'Rose Gold', 'Pearl', 'Turquoise',
  'Crimson', 'Bronze', 'Ash', 'Beige', 'Lilac', 'Indigo', 'Neon Green', 'Hot Pink', 'Steel', 'Sapphire',
  'Emerald', 'Ruby', 'Glow-in-the-dark', 'Transparent', 'Camouflage', 'Gradient', 'Pastel Rainbow', 'Zebra Stripes', 'Galaxy', 'Obsidian'
];

const abilities = [
  'Fire Breath', 'Invisibility', 'Super Speed', 'Healing', 'Flight', 'Telepathy', 'None', 'Water Control', 'Earthquake Stomp', 'Lightning Strike',
  'Ice Blast', 'Shape Shift', 'Teleportation', 'Shadow Walk', 'Clone Self', 'Energy Shield', 'Poison Spit', 'Sleep Dust', 'Charm', 'Time Slow',
  'Sonic Boom', 'Laser Eyes', 'Web Shot', 'Hypnosis', 'Camouflage', 'Bubble Shield', 'Night Vision', 'Burrow', 'Magnetism', 'Leaf Blade',
  'Sandstorm', 'Wind Slash', 'Grow Vines', 'Electric Pulse', 'Summon Minions', 'Venom Touch', 'Metal Skin', 'Frost Aura', 'Berserk Mode', 'Teleport Ally',
  'Gravity Control', 'Lava Trail', 'Illusion', 'Thunder Roar', 'Shrink', 'Enrage', 'Sticky Web', 'Glide', 'Regeneration', 'Charm Song'
];

const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomStat(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create a reward pet
async function createRewardPet(userId) {
  const pet = new Pet({
    owner: userId,
    name: `Saver${Math.floor(Math.random() * 10000)}`,
    type: getRandom(petTypes),
    color: getRandom(petColors),
    age: getRandomStat(1, 15),
    level: getRandomStat(5, 15),
    strength: getRandomStat(50, 100),
    agility: getRandomStat(50, 100),
    intelligence: getRandomStat(50, 100),
    rarity: rarities.slice(2)[Math.floor(Math.random() * 3)],
    specialAbility: abilities.slice(0, 6)[Math.floor(Math.random() * 6)]
  });
  return await pet.save();
}

// /savingplan/create
exports.createSavingPlan = async (req, res) => {
  try {
    const { goalAmount, duration } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!goalAmount || !duration || goalAmount <= 0 || duration <= 0) {
      return res.status(400).json({ message: 'Invalid goal amount or duration' });
    }

    // Check if the user has an active (incomplete) saving plan
    const activePlan = await SavingPlan.findOne({ user: userId, isCompleted: false });
    if (activePlan) {
      return res.status(400).json({ message: 'You already have an active saving plan. Complete it before creating a new one.' });
    }

    // Calculate end date
    const endDate = moment().add(duration, 'days').toDate();
    const dailyAmount = Math.ceil(goalAmount / duration);

    // Create the saving plan
    const savingPlan = new SavingPlan({
      user: userId,
      goalAmount,
      duration,
      dailyAmount,
      currentlySaved: 0,
      isCompleted: false,
      startDate: new Date(),
      endDate,
      lastSavedDate: null
    });

    await savingPlan.save();
    res.status(201).json({ message: 'Saving plan created', savingPlan });
  } catch (err) {
    console.error('Error creating saving plan:', err);
    res.status(500).json({ error: err.message });
  }
};

// /savingplan/update
exports.updateSavingPlan = async (req, res) => {
    try {
      console.log('updateSavingPlan called');
      const { savingPlanId } = req.body;
      const userId = req.user.id;
      console.log('Request body:', req.body);
      console.log('User ID:', userId);
  
      if (!savingPlanId) {
        console.log('Invalid savingPlanId');
        return res.status(400).json({ message: 'Invalid savingPlanId' });
      }
  
      const savingPlan = await SavingPlan.findOne({ _id: savingPlanId, user: userId });
      console.log('Fetched savingPlan:', savingPlan);
      if (!savingPlan) {
        console.log('Saving plan not found');
        return res.status(404).json({ message: 'Saving plan not found.' });
      }
  
      if (savingPlan.isCompleted) {
        console.log('Saving plan is already completed');
        return res.status(400).json({ message: 'Saving plan is already completed.' });
      }
  
      // Check if user already saved today
      const today = moment().startOf('day');
      const lastSaved = moment(savingPlan.lastSavedDate).startOf('day');
      console.log('Today:', today.format(), 'LastSaved:', lastSaved.format());
      if (lastSaved.isSame(today)) {
        console.log('User already saved today');
        return res.status(400).json({ message: 'You can only save once per day.' });
      }
  
      const updateData = {
        $inc: { currentlySaved: savingPlan.dailyAmount },
        lastSavedDate: new Date()
      };
      console.log('Initial updateData:', updateData);
  
      // Check if goal is reached
      const newTotal = savingPlan.currentlySaved + savingPlan.dailyAmount;
      let createdPet = null;
      console.log('newTotal:', newTotal, 'goalAmount:', savingPlan.goalAmount);
      
      if (newTotal >= savingPlan.goalAmount) {
        updateData.$set = {
          isCompleted: true,
          completedAt: new Date(),
          currentlySaved: savingPlan.goalAmount // Ensure we don't exceed the goal
        };
        console.log('Goal reached, updateData:', updateData);
        
        // Create a pet as reward for completing the saving plan
        createdPet = await createRewardPet(userId);
        console.log('Created reward pet:', createdPet);
      }
  
      const updatedSavingPlan = await SavingPlan.findByIdAndUpdate(
        savingPlanId,
        updateData,
        { new: true }
      );
      console.log('Updated savingPlan:', updatedSavingPlan);
  
      // Calculate new daily amount if not completed
      if (!updatedSavingPlan.isCompleted) {
        const daysRemaining = moment(updatedSavingPlan.endDate).diff(moment(), 'days') + 1;
        const remainingAmount = updatedSavingPlan.goalAmount - updatedSavingPlan.currentlySaved;
        const newDailyAmount = Math.ceil(remainingAmount / daysRemaining);
        console.log('daysRemaining:', daysRemaining, 'remainingAmount:', remainingAmount, 'newDailyAmount:', newDailyAmount);
        
        updatedSavingPlan.dailyAmount = newDailyAmount;
        await updatedSavingPlan.save();
        console.log('Saved updated dailyAmount');
      }
  
      res.status(200).json({
        message: updatedSavingPlan.isCompleted ? 'Congratulations! Saving plan completed.' : 'Daily savings added.',
        savingPlan: updatedSavingPlan,
        rewardPet: createdPet
      });
    } catch (err) {
      console.error('Error updating saving plan:', err);
      res.status(500).json({ error: err.message });
    }
  };

// /savingplan/
exports.getUserSavingPlans = async (req, res) => {
  try {
    const userId = req.user.id;
    const savingPlans = await SavingPlan.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JS objects
    
    // Add calculated fields
    const enhancedPlans = savingPlans.map(plan => {
      const daysRemaining = Math.max(0, moment(plan.endDate).diff(moment(), 'days') + 1);
      const remainingAmount = plan.goalAmount - plan.currentlySaved;
      const adjustedDaily = plan.isCompleted ? 0 : Math.ceil(remainingAmount / daysRemaining);
      
      return {
        ...plan,
        daysRemaining,
        remainingAmount,
        adjustedDailyAmount: adjustedDaily,
        canSaveToday: !plan.isCompleted && 
                     (!plan.lastSavedDate || !moment(plan.lastSavedDate).isSame(moment(), 'day'))
      };
    });

    res.status(200).json(enhancedPlans);
  } catch (err) {
    console.error('Error fetching user saving plans:', err);
    res.status(500).json({ error: err.message });
  }
};

// /savingplan/:id
exports.getSavingPlanById = async (req, res) => {
  try {
    const savingPlanId = req.params.id;
    const userId = req.user.id;
    
    const savingPlan = await SavingPlan.findOne({ _id: savingPlanId, user: userId }).lean();
    
    if (!savingPlan) {
      return res.status(404).json({ message: 'Saving plan not found.' });
    }
    
    // Add calculated fields
    const daysRemaining = Math.max(0, moment(savingPlan.endDate).diff(moment(), 'days') + 1);
    const remainingAmount = savingPlan.goalAmount - savingPlan.currentlySaved;
    const adjustedDaily = savingPlan.isCompleted ? 0 : Math.ceil(remainingAmount / daysRemaining);
    
    const enhancedPlan = {
      ...savingPlan,
      daysRemaining,
      remainingAmount,
      adjustedDailyAmount: adjustedDaily,
      canSaveToday: !savingPlan.isCompleted && 
                   (!savingPlan.lastSavedDate || !moment(savingPlan.lastSavedDate).isSame(moment(), 'day'))
    };
    
    res.status(200).json(enhancedPlan);
  } catch (err) {
    console.error('Error fetching saving plan by ID:', err);
    res.status(500).json({ error: err.message });
  }
};

// /savingplan/all
exports.getAllUsersSavingPlans = async (req, res) => {
  try {
    const savingPlans = await SavingPlan.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json(savingPlans);
  } catch (err) {
    console.error('Error fetching all users saving plans:', err);
    res.status(500).json({ error: err.message });
  }
};

// /savingplan/delete/:id
exports.deleteSavingPlan = async (req, res) => {
  try {
    const savingPlanId = req.params.id;
    const userId = req.user.id;
    
    const savingPlan = await SavingPlan.findOne({ _id: savingPlanId, user: userId });
    
    if (!savingPlan) {
      return res.status(404).json({ message: 'Saving plan not found.' });
    }
    
    await SavingPlan.findByIdAndDelete(savingPlanId);
    res.status(200).json({ message: 'Saving plan deleted successfully.' });
  } catch (err) {
    console.error('Error deleting saving plan:', err);
    res.status(500).json({ error: err.message });
  }
};