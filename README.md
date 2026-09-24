# Welcome to My Fullstack Blog

---

## Task

The goal of this project was to build a complete fullstack blog application with a React frontend and an Express backend.

The main challenge was to connect the frontend and backend into one application while implementing authentication, authorization, CRUD operations, image uploads, protected routes, and admin functionality.

The project uses React and React Router on the frontend, and Express, Prisma, SQLite, JWT, and bcrypt on the backend.

## Description

This project is a fullstack blog application where users can:

- Register and log in
- Log out
- View published blog posts
- View individual posts
- Create posts
- Edit their own posts
- Delete their own posts
- Upload post images
- Preview images before uploading

The application also includes an admin role.

Administrators can:

- View all users
- View all posts, including unpublished posts
- Publish and unpublish posts
- Edit any post
- Delete any post

Authentication is handled using JWT tokens. Passwords are hashed with bcrypt before being stored in the database.

Both the frontend and backend protect authenticated functionality. React uses protected routes, while Express uses authentication and admin middleware.

The database is SQLite and is managed with Prisma ORM.

## Technologies

- React
- React Router
- TypeScript
- Vite
- Express
- Prisma
- SQLite
- JWT
- bcrypt
- Multer
- CSS


## Database Schema

User

The User model contains:

id
email
username
passwordHash
createdAt
role

A user can have many posts.

Post

The Post model contains:

id
title
content
imageUrl
published
authorId
createdAt
updatedAt

Each post belongs to one user.

## Installation

Clone the project and enter the project directory.

Install the root dependencies:

bash
npm install

Install the client dependencies:

cd client
npm install

Install the server dependencies:

cd ../server
npm install

Create a `.env` file in the server directory and add your database URL and JWT secret.

Example:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"

Use whatever database filename you actually have instead of `dev.db`.

Also, the real `.env` file should **not be committed to Git**.

Run the Prisma migration:

npx prisma migrate dev

Run the seed script:

npx prisma db seed

Return to the project root:

cd ..

Start both the frontend and backend:

npm run dev

The root dev script starts both applications at the same time.


## One important detail

Your root `package.json` has:

"dev": "concurrently \"npm run dev --prefix client\" \"npm run dev --prefix server\""

So you don't need to start the client and server separately. Running:

npm run dev

from the root starts both.

## Usage

Open the frontend in your browser.

The application starts with a page containing Login and Register options.

After logging in, authenticated users can:

View posts
Create new posts
Edit their own posts
Delete their own posts

Administrators have access to the Admin Panel where they can manage users and posts.

Images can be uploaded when creating or editing posts. Supported image types are JPEG, PNG, and WebP, with a maximum file size of 5 MB.

Uploaded images are stored in the server uploads directory and served through the /uploads route.

Authentication

Authentication works using JWT tokens.

Register
POST /api/auth/register

Creates a new user and returns a JWT token.

Login
POST /api/auth/login

Verifies the user's email and password and returns a JWT token.

Current User
GET /api/auth/me

Returns the currently authenticated user.

This endpoint requires:

Authorization: Bearer <token>
Post API
Get published posts
GET /api/posts

Returns all published posts.

Get a single post
GET /api/posts/:id

Returns one post and its author information.

Create a post
POST /api/posts

Requires authentication.

Supports:

Title
Content
Image upload
Update a post
PUT /api/posts/:id

Requires authentication.

Users can edit their own posts, while administrators can edit any post.

Delete a post
DELETE /api/posts/:id

Requires authentication.

Users can delete their own posts, while administrators can delete any post.

Admin API
Get all users
GET /api/admin/users

Admin access required.

Get all posts
GET /api/admin/posts

Admin access required.

This endpoint also returns unpublished posts.

Toggle published status
PATCH /api/admin/posts/:id/published

Admin access required.

This toggles a post between published and unpublished.

Seed Accounts

The seed script creates one administrator and two regular users.

Admin
Email: admin@example.com
Password: admin123
Role: admin

User 1
Email: user1@example.com
Password: user123
Role: user

User 2
Email: user2@example.com
Password: user456
Role: user

These accounts are intended for local development and testing.

Error and Loading States

The application includes:

Loading states while data is being fetched
Error messages for failed requests
Empty states when there are no posts or users
Authentication error handling
Protected route redirection
Token expiration handling
What I Learned

During this project, I learned how a frontend and backend communicate through a REST API and how authentication works across that boundary.

I learned how to:

Hash passwords securely with bcrypt
Create and verify JWT tokens
Store authentication tokens on the frontend
Protect React routes
Protect Express API endpoints with middleware
Differentiate authentication from authorization
Use Prisma with SQLite
Build CRUD APIs
Handle file uploads with Multer
Use FormData for multipart requests
Implement role-based authorization
Manage loading, error, and empty states in React
Connect frontend state with backend data

 The most important concept I learned was that frontend protection alone is not enough. The backend must also verify authentication and authorization for every protected operation.

### The Core Team


<span><i>Made at <a href='https://qwasar.io'>Qwasar SV -- Software Engineering School</a></i></span>
<span><img alt='Qwasar SV -- Software Engineering School's Logo' src='https://storage.googleapis.com/qwasar-public/qwasar-logo_50x50.png' width='20px' /></span>
