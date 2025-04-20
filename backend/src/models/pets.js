const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: true },
    age: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    strength: { type: Number, default: 1 },
    agility: { type: Number, default: 1 },
    intelligence: { type: Number, default: 1 },
    rarity: { type: String, required: true },
    specialAbility: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Pet', petSchema);