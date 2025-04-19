

# Savr

**Savr** is a gamified budget tracker designed to make saving money fun and rewarding. Built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), Savr helps users set financial goals, track their savings, and get rewarded with unique collectible characters and pets as they progress.

## Features

- **Set Savings Goals**: Define your target amount and deadline.
- **Daily Savings Plan**: Get an automated daily saving breakdown.
- **Gamified Rewards**: Unlock cute, pixel-art style characters and pets as you hit milestones.
- **Progress Tracker**: Visualize your journey toward your goal.
- **Community and Leaderboard** _(Coming Soon)_: Compete or collaborate with other savers.
- **Pet System** _(In Progress)_: Use your pets for future battles and mini-games.

## Tech Stack

- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Others**: Cloudinary (for image uploads), Mongoose, Framer Motion (for animations)

## Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/savr.git
   cd savr
   ```

2. **Install client dependencies:**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies:**
   ```bash
   cd ../server
   npm install
   ```

4. **Set up environment variables:**

   Create `.env` files in both `/client` and `/server` directories as needed. Example for server:

   ```
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Run the app:**

   In two terminals:

   ```bash
   # Terminal 1: server
   cd server
   npm run dev

   # Terminal 2: client
   cd client
   npm run dev
   ```

## Screenshots

_Coming soon_

## Roadmap

- [x] Basic savings goal tracker
- [x] Randomized pet/character generator
- [ ] Character collection gallery
- [ ] Pet evolution system
- [ ] Online battles & leaderboard
- [ ] Community features

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your ideas.

## License

[MIT](LICENSE)
