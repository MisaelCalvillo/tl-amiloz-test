# Loan Management System API

## Overview

This project is a Loan Management System API built with Node.js, Express, and Prisma. It provides endpoints for user management, offer creation, loan approval, and payment processing.

Production API URL: https://tl-amiloz-test.onrender.com

## Table of Contents

1. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running the Project](#running-the-project)
2. [Project Structure](#project-structure)
3. [Key Processes](#key-processes)
   - [Offer Approval Process](#offer-approval-process)
4. [API Endpoints](#api-endpoints)
5. [Authentication](#authentication)
6. [Database Schema](#database-schema)
7. [Testing](#testing)
8. [Deployment](#deployment)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- SQLite (for local development)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/loan-management-system.git
   cd loan-management-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` if needed

4. Set up the database:
   ```
   npx prisma migrate dev
   npx prisma db seed
   ```

### Running the Project

1. Start the development server:
   ```
   npm run dev
   ```

2. The API will be available at `http://localhost:3000`

## Project Structure

```
src/
├── controllers/    # Request handlers
├── middleware/     # Custom middleware (auth, error handling)
├── models/         # Data models and database interactions
├── routes/         # API route definitions
├── services/       # Business logic
├── types/          # TypeScript type definitions and enums
├── utils/          # Utility functions
└── index.ts        # Application entry point
```

## Key Processes

### Offer Approval Process

1. An admin creates an offer for a user through the `/api/users/:userId/offers` endpoint.
2. The user can view their offers via the `/api/users/:userId/offers` endpoint.
3. An admin approves an offer using the `/api/offers/:offerId/approve` endpoint.
4. Upon approval, a loan is created with installments based on the offer terms.
5. The offer status is updated to 'APPROVED', and a new loan record is created.

## API Endpoints

### User Management
- `POST /api/users`: Create a new user
- `GET /api/users/:userId`: Get user details

### Offer Management
- `POST /api/users/:userId/offers`: Create a new offer
- `GET /api/users/:userId/offers`: Get offers for a user
- `GET /api/offers/:offerId`: Get offer details
- `POST /api/offers/calculate`: Calculate offer details
- `POST /api/offers/:offerId/approve`: Approve an offer (Admin only)

### Loan Management
- `GET /api/loans/:loanId`: Get loan details
- `PATCH /api/loans/:loanId/status`: Update loan status (Admin only)
- `GET /api/loans`: Get all loans (Admin only)

### Payment Management
- `POST /api/loans/:loanId/payments`: Make a payment
- `GET /api/loans/:loanId/payments`: Get payments for a loan

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the JWT in the `x-access-token` header for authenticated requests.

## Database Schema

The main entities in the database are:
- User
- Role
- Offer
- Loan
- Installment
- Payment

Refer to the `prisma/schema.prisma` file for detailed schema information.

## Testing

Run the test suite with:
```
npm test
```

## Deployment

The API is deployed on Render. To deploy your own instance:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the environment variables (including `DATABASE_URL`)
4. Deploy the main branch

For more detailed instructions, refer to the [Render documentation](https://render.com/docs).