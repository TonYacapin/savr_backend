const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');

// Ensure the pet_images directory exists
const petImagesDir = path.join(__dirname, '../public/pet_images');
if (!fs.existsSync(petImagesDir)) {
    fs.mkdirSync(petImagesDir, { recursive: true });
}

// Free image sources with pixel art
const PIXEL_ART_SOURCES = {
    Dog: [
        'https://opengameart.org/sites/default/files/styles/medium/public/samson-sprite_0.png',
        'https://opengameart.org/sites/default/files/styles/medium/public/rounded_eyes_dog_game_character_sprites_0.jpg'
    ],
    Cat: [
        'https://opengameart.org/sites/default/files/styles/medium/public/cat_2.png',
        'https://opengameart.org/sites/default/files/styles/medium/public/cat_5.png'
    ],
    Dragon: [
        'https://opengameart.org/sites/default/files/styles/medium/public/pisilohepunane3_preview.png',
        'https://opengameart.org/sites/default/files/styles/medium/public/pisilohe12_preview.png'
    ],
    Unicorn: [
        'https://opengameart.org/sites/default/files/styles/medium/public/unicorn%20with%20background.png',
        'https://opengameart.org/sites/default/files/unicorn_0.png'
    ],
    Default: [
        'https://opengameart.org/sites/default/files/styles/medium/public/samson-sprite_0.png',
    ]
};

async function fetchPixelArtImage(petType) {
    const sources = PIXEL_ART_SOURCES[petType] || PIXEL_ART_SOURCES['Default'];
    const randomImageUrl = sources[Math.floor(Math.random() * sources.length)];
    
    try {
        const response = await axios.get(randomImageUrl, { responseType: 'arraybuffer' });
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error('Failed to fetch image:', error.message);
        throw new Error('Could not fetch pixel art image');
    }
}

async function applyPixelEffect(imageBuffer) {
    // First resize to small size to pixelate
    const pixelated = await sharp(imageBuffer)
        .resize(64, 64, { kernel: sharp.kernel.nearest })
        .toBuffer();
    
    // Then scale back up with pixelation effect
    return sharp(pixelated)
        .resize(512, 512, { kernel: sharp.kernel.nearest })
        .toBuffer();
}

async function generatePetImage(pet) {
    try {
        // 1. Fetch a base pixel art image
        const originalImage = await fetchPixelArtImage(pet.type);
        
        // 2. Apply pixelation effect (if needed)
        const pixelArtBuffer = await applyPixelEffect(originalImage);
        
        // 3. Create canvas for adding text and decorations
        const canvas = createCanvas(512, 512);
        const ctx = canvas.getContext('2d');
        
        // 4. Draw the pixel art image
        const img = await loadImage(pixelArtBuffer);
        ctx.drawImage(img, 0, 0, 512, 512);
        
        // 5. Add pet info with pixel-style text
        ctx.font = '20px, cursive';
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        
        // Draw text with outline
        const drawPixelText = (text, x, y) => {
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
        };
        
        drawPixelText(pet.name, 256, 40);
        drawPixelText(`${pet.type} • ${pet.rarity}`, 256, 70);
        
        // 6. Save the final image
        const imageFileName = `${pet._id}.png`;
        const imagePath = path.join(petImagesDir, imageFileName);
        
        await sharp(canvas.toBuffer())
            .toFile(imagePath);
            
        console.log(`Pixel art pet saved at: ${imagePath}`);
        return `/pet_images/${imageFileName}`;
        
    } catch (error) {
        console.error('Error generating pet image:', error);
        throw error;
    }
}

module.exports = { generatePetImage };