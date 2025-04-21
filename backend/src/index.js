const express = require('express');
require('dotenv').config();
const connectDB = require('./db/connection');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// Create pet_images directory if it doesn't exist
const petImagesDir = path.join(__dirname, 'public', 'pet_images');
if (!fs.existsSync(petImagesDir)) {
    fs.mkdirSync(petImagesDir, { recursive: true });
    console.log('Created pet_images directory');
}

// Static files with explicit prefix
app.use('/public', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());

// Explicit image serving route
app.get('/pet_images/:imageName', (req, res) => {
    const imagePath = path.join(__dirname, 'public', 'pet_images', req.params.imageName);
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('Error sending image:', err);
            res.status(404).send('Image not found');
        }
    });
});

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Express server is running!');
});

app.use('/pets', require('./routes/petsRoutes'));
app.use('/login', require('./routes/loginRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/savingplans', require('./routes/savingplanRoutes'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Pet images directory: ${petImagesDir}`);
});