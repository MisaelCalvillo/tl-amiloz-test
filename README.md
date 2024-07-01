# Loan Management System API

## Quick Links

- **Repository**: [https://github.com/MisaelCalvillo/tl-amiloz-test](https://github.com/MisaelCalvillo/tl-amiloz-test)
- **Production API**: [https://tl-amiloz-test.onrender.com/](https://tl-amiloz-test.onrender.com/)
- **Database Interface**: [https://tl-amiloz-test-1.onrender.com/](https://tl-amiloz-test-1.onrender.com/)
- **Postman Collection**: [View on Postman](https://api.postman.com/collections/16540767-c8d0adb1-09dd-4388-8474-b66a6e79c52b?access_key=PMAT-01J1QK00R7VABMWHWPB48WKBGK)

## Overview

This project is a Loan Management System API built with Node.js, Express, and Prisma. It provides endpoints for user management, offer creation, loan approval, and payment processing.

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
- PostgreSQL (v12 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/MisaelCalvillo/tl-amiloz-test.git
   cd tl-amiloz-test
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` with your PostgreSQL connection string

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

## Database Access

You can view and interact with the database using the provided database interface:

[https://tl-amiloz-test-1.onrender.com/](https://tl-amiloz-test-1.onrender.com/)

This interface allows you to explore the database schema, run queries, and view data directly.


## API Testing

To test the API endpoints, you can use the provided Postman collection:

1. Open Postman
2. Click on "Import" > "Link"
3. Paste the following URL:
   ```
   https://api.postman.com/collections/16540767-c8d0adb1-09dd-4388-8474-b66a6e79c52b?access_key=PMAT-01J1QK00R7VABMWHWPB48WKBGK
   ```
4. Click "Continue" and then "Import"

This collection contains pre-configured requests for all available endpoints, making it easy to test the API functionality.


## Deployment

The API is deployed on Render. You can access the production version at:

[https://tl-amiloz-test.onrender.com/](https://tl-amiloz-test.onrender.com/)

To deploy your own instance:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the environment variables (including `DATABASE_URL` for your PostgreSQL database)
4. Add the following build commands:
   ```
   npm install
   npx prisma generate
   npx prisma migrate deploy
   ```
5. Set the start command to: `npm start`
6. Deploy the main branch

For more detailed instructions, refer to the [Render documentation](https://render.com/docs).


## API Usage Guide

This section provides detailed instructions on how to use the main endpoints of the API. Make sure you have the API running locally or use the production URL: https://tl-amiloz-test.onrender.com/

### 1. User Creation

**Endpoint:** `POST /api/users`

**Description:** Create a new user in the system.

**Request Body:**
```json
{
  "idDocumentNumber": "123456789",
  "firstName": "John",
  "lastName": "Doe",
  "password": "securepassword",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "roleId": "user"
}
```

**Response:** 
```json
{
  "id": "user-uuid",
  "idDocumentNumber": "123456789",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "1234567890",
  "roleId": "user"
}
```

### 2. User Login

**Endpoint:** `POST /api/users/login`

**Description:** Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "auth": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "john.doe@example.com",
    "roleId": "user"
  }
}
```

**Note:** Use the received token in the `x-access-token` header for authenticated requests.

### 3. Calculate Offer

**Endpoint:** `POST /api/offers/calculate`

**Description:** Calculate loan offer details based on input parameters.

**Request Body:**
```json
{
  "principalAmount": 10000,
  "annualInterestRate": 0.05,
  "termInDays": 365,
  "paymentFrequencyId": "monthly"
}
```

**Response:**
```json
{
  "principalAmount": 10000,
  "annualInterestRate": 0.05,
  "termInDays": 365,
  "paymentFrequencyId": "monthly",
  "numberOfPayments": 12,
  "paymentAmount": 856.07,
  "totalInterest": 272.84,
  "totalRepayment": 10272.84
}
```

### 4. Create Offer

**Endpoint:** `POST /api/users/:userId/offers`

**Description:** Create a new offer for a specific user.

**Headers:**
- `x-access-token`: JWT token received from login

**Request Body:**
```json
{
  "amount": 10000,
  "interestRate": 0.05,
  "termInDays": 365,
  "paymentFrequencyId": "monthly"
}
```

**Response:**
```json
{
  "id": "offer-uuid",
  "userId": "user-uuid",
  "amount": 10000,
  "interestRate": 0.05,
  "termInDays": 365,
  "installments": 12,
  "installmentAmount": 856.07,
  "totalAmount": 10272.84,
  "paymentFrequencyId": "monthly",
  "status": "PENDING",
  "createdAt": "2023-05-20T10:30:00Z",
  "updatedAt": "2023-05-20T10:30:00Z"
}
```

### 5. Approve Offer

**Endpoint:** `POST /api/offers/:offerId/approve`

**Description:** Approve an offer and create a loan (Admin only).

**Headers:**
- `x-access-token`: JWT token of an admin user

**Request Body:** Empty

**Response:**
```json
{
  "message": "Loan approved and installments generated",
  "loan": {
    "id": "loan-uuid",
    "userId": "user-uuid",
    "offerId": "offer-uuid",
    "totalAmount": 10272.84,
    "remainingAmount": 10272.84,
    "status": "ACTIVE",
    "approvedAt": "2023-05-20T11:00:00Z",
    "createdAt": "2023-05-20T11:00:00Z",
    "updatedAt": "2023-05-20T11:00:00Z"
  }
}
```

## Using the API

1. Start by creating a user account using the User Creation endpoint.
2. Log in using the User Login endpoint to receive a JWT token.
3. Use the Calculate Offer endpoint to get details about a potential loan.
4. Create an offer for a user using the Create Offer endpoint (requires admin authentication).
5. Finally, approve the offer using the Approve Offer endpoint (requires admin authentication) to create a loan.

Remember to include the JWT token in the `x-access-token` header for authenticated requests. Admin operations (like creating and approving offers) require an admin user token.

For a complete list of endpoints and more detailed information, refer to the API documentation or use the provided Postman collection.