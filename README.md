# Community Help Platform (MERN)

A community website where users can post help requests and offer help to others.

## Features
- Browse and search help requests
- Create a help request
- Offer help to a request
- Update request status and delete requests
- REST API with Express and MongoDB/Mongoose
- React frontend with responsive styling

## Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Run the backend
1. Open a terminal in `server`.
2. Install packages:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and set `MONGO_URI`.
4. Start the API:
   ```bash
   npm run dev
   ```
The API runs on `http://localhost:5000`.

## Run the frontend
1. Open a second terminal in `client`.
2. Install packages:
   ```bash
   npm install
   ```
3. Start React:
   ```bash
   npm run dev
   ```
Open the local URL printed by Vite (usually `http://localhost:5173`).

## Notes
- The UI and CRUD API work without login for a classroom demo. Before public deployment, add authentication, authorization, input validation, rate limiting, and moderation.
- The API uses MongoDB when `MONGO_URI` is configured. If MongoDB is not running, the server reports a connection error; the React frontend will show an API error message.
