# MERN Exercise Tracker 🏋️‍♂️

[![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-blue)](https://www.mongodb.com/mern-stack)
[![Deployed on Railway](https://img.shields.io/badge/Deployed%20on-Railway-%23B131F3)](https://railway.app)

A full-stack fitness application built with the MERN stack (MongoDB, Express, React, Node.js) to track and analyze workout routines.

![Exercise Tracker Screenshot](https://i.imgur.com/fWbmVKP.jpeg)

## Live Demo

➡️ [Try the Live App](https://mern-exercise-tracker-production-cdae.up.railway.app)

## Features

### Exercise Management
- ✍️ Create user & exercise logs with details (name, description, duration, date)
- 📝 Edit existing workout entries
- 🗑️ Delete exercises
- 📊 View complete workout history

### User Experience
- 📱 Fully responsive design
- ⚡ Fast loading with Vite
- 🛡️ Error boundaries for graceful failures
- 🔄 Real-time updates

### Technical Highlights
- 🔒 Secure CORS configuration
- 🚀 Optimized production build
- 📦 Monorepo architecture
- 🤖 Automated CI/CD via GitHub Actions

## Tech Stack

**Frontend:**
- React 18
- React Router 6
- Vite (Build Tool)
- Bootstrap 5 (Styling)
- Error Boundary (Error Handling)

**Backend:**
- Node.js 18
- Express.js
- MongoDB (Atlas)
- Mongoose ODM

**DevOps:**
- Railway.app (Hosting)
- GitHub Actions (CI/CD)
- Environment Variables

## Installation

1. Clone the repository:
git clone https://github.com/oli4ever/mern-exercise-tracker.git
2. Install dependencies:
   cd mern-exercise-tracker
   npm install
   cd client && npm install
   cd ../server && npm install
3. Set up environment variables:
   # server/.env
   ATLAS_URI=your_mongodb_connection_string
   PORT=5000

  # client/.env
  VITE_API_URL=http://localhost:5000
4. Run the development environment:
   # Start backend
     cd server && npm run dev

   # Start frontend (in new terminal)
     cd client && npm run dev
