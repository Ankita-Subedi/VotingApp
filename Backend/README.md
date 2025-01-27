# Project Title

Voting Application

## Description

This is a Voting Application that allows users to register, log in, and vote for candidates. It includes admin functionalities for managing candidates.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Run `npm install` to install the dependencies.
4. Create a `.env` file and add your MongoDB connection string and JWT secret.

## Usage

### User Routes

- **POST /user/signup**: Register a new user.
- **POST /user/login**: Log in an existing user.
- **GET /user/profile**: Get user profile information.

### Candidate Routes

- **POST /candidate**: Add a new candidate (admin only).
- **GET /candidate/profile**: Get candidate profile information.
- **PUT /candidate/:candidateID**: Update candidate information (admin only).
- **DELETE /candidate/:candidateID**: Delete a candidate (admin only).
- **POST /candidate/vote/:candidateID**: Vote for a candidate.
- **GET /candidate/vote/count**: Get the vote count for all candidates.
- **GET /candidate**: Get a list of all candidates.

## Models

### User Model

- `name`: String, required
- `age`: Number, required
- `mobile`: String
- `address`: String, required
- `citizenshipNum`: Number, required, unique
- `password`: String, required
- `role`: String, enum: ['voter', 'admin'], default: 'voter'
- `isVoted`: Boolean, default: false

### Candidate Model

- `name`: String, required
- `party`: String, required
- `age`: Number, required
- `votes`: Array of objects containing user ID and vote timestamp
- `voteCount`: Number, default: 0

## Routes

The application uses Express.js for routing. The routes are organized into separate files for user and candidate functionalities.

## Database

The application connects to a MongoDB database using Mongoose. The connection URL is stored in the `.env` file.

## JWT Authentication

JWT is used for authenticating users. Tokens are generated upon successful login and are required for protected routes.