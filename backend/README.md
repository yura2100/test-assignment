## Dependencies

 - [Firebase Authentication](https://firebase.google.com/docs/auth) - used for email + password login, social login, token management.
 - [SQLite](https://sqlite.org/index.html) - used for persisting identities and user info. Can be easily changed with any other SQL or NoSQL database. Selected for easy setup.
 - [Moralis Authentication](https://docs.moralis.io/authentication-api) - used for web3 authentication via [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361). Can be easily changed with custom EIP-4361 implementation. Selected for easy setup.
 - [Nest.js](https://docs.nestjs.com/) - used for wallet authentication, wallets linking, token verification and custodial wallet creation. Can be changed with serverless functions or Next.js APIs. Selected for OOP design and easy setup.
 - [Prisma](https://www.prisma.io/) - used for database migrations and ORM. Can be easily changed with any other ORM. Selected for type-safety.
 - [ethers.js](https://docs.ethers.io/v5/) - used for wallet creation. Can be easily changed with any other web3 library. Selected for easy setup.

## Setup

### 1. Install dependencies

```bash
npm ci
```

### 2. Setup environment variables

```bash
cp .env.example .env
```

### 3. Add Firebase credentials to certs directory

### 4. Run migrations

```bash
npx prisma migrate dev --name init
```

### 5. Run the app

```bash
npm run start:dev
```

## Overview

System supports both web2 and web3 authentication.
Web2 authentication is done via Firebase Authentication.
Web3 authentication is done via API and EIP-4361 implementation.
Both authentication methods are used to create a user in the database.
User can then link multiple wallets to their account.
Wallets are created via Nest.js API.
After sign up a custodial wallet is created for the user.

## Database

Database is created using SQLite.
Database schema is defined in `prisma/schema.prisma`.
Database consists of 2 tables: `User` and `Identity`.
`User` table contains all user info.
`Identity` table contains all identities (web2 and web3) linked to the user.

## API

### Base URL

`https://localhost:3000`

### Generate EIP-4361 Message

`POST /authentication/make-message`

Creates a message to be signed by the user's wallet.

**Request Body**

| Field   | Type   | Required | Description                            |
| ------- | ------ | -------- | -------------------------------------- |
| address | string | Yes      | The user's wallet address.              |

**Response**

| Field   | Type   | Description                   |
| ------- | ------ | ----------------------------- |
| message | string | The message to be signed.     |

### Sign In with Wallet

`POST /authentication/sign-in-with-wallet`

Authenticates a user based on a signed message from their wallet.

**Request Body**

| Field    | Type   | Required | Description                                            |
| -------- | ------ | -------- | ------------------------------------------------------ |
| message  | string | Yes      | The message that was signed by the user's wallet.      |
| signature| string | Yes      | The signature produced by the user's wallet for message.|

**Response**

| Field | Type   | Description                   |
| ----- | ------ | ----------------------------- |
| token | string | The authentication token.     |

### Link Wallet

`POST /authentication/link-wallet`

Links a user's wallet to their account.

**Request Body**

| Field    | Type   | Required | Description                                            |
| -------- | ------ | -------- | ------------------------------------------------------ |
| message  | string | Yes      | The message that was signed by the user's wallet.      |
| signature| string | Yes      | The signature produced by the user's wallet for message.|

**Response**

This endpoint has no response body.

*Note: This endpoint requires authentication with an authentication token in the request headers.* 

## Integration guide

### Email + Password login / Socials login

1. Sign in with Firebase Authentication on frontend.
2. Get Firebase Authentication token from Firebase.
3. Send any request to the API with the token in the request headers to sync firebase and database and custodial wallet creation.

### Web3 login

1. Generate EIP-4361 message on frontend with `POST /authentication/make-message`.
2. Sign the message with the user's wallet.
3. Send the signed message and signature to the API with `POST /authentication/sign-in-with-wallet`.
4. Get authentication token from the API.
5. Sign in on frontend with `signInWithCustomToken(token)`.
6. Send any request to the API with the token in the request headers to sync firebase and database and custodial wallet creation.

### Linking wallet

1. Login with any of the methods above.
2. Generate EIP-4361 message on frontend with `POST /authentication/make-message`.
3. Sign the message with the user's wallet.
4. Send the signed message and signature to the API with `POST /authentication/link-wallet`.

For more information regarding implementation see `src/authentication/authentication.service.ts`