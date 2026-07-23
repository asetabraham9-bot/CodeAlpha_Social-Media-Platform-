# Mini Social Media Platform

A full-stack social media web application built with **React 18**, **Express.js**, and **MongoDB Atlas**. Users can register, create profiles, publish posts with optional images/videos, comment, like, and follow other users. Includes an admin dashboard for content moderation.

Supports **light and dark mode** with system preference detection and persistent theme selection.

## Tech Stack


| Layer    | Technology                                   |
| -------- | -------------------------------------------- |
| Frontend | React 18, React Router 7, Tailwind CSS, Vite |
| Backend  | Express.js, Mongoose                         |
| Database | MongoDB Atlas                                |
| Auth     | JWT                                          |




## Project Structure

```
mini-social-media-platform/
├── client/          # React frontend
├── server/          # Express backend
├── README.md
└── .gitignore
```



## Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)



## Setup



### 1. Clone and install dependencies

```bash
# Backend
cd server
npm install
cp .env.example .env

# Frontend
cd ../client
npm install
```

### 2. Run the application

Open **two terminals** and start the backend first, then the frontend:

```bash
# Terminal 1 - Backend (start this first)
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```


### 3. An admin user credentials

Email: admin@social.com

password: 12345678

Note: To use as a user, create one account and login.


## Features


### User

- Register and login with JWT authentication
- Manage profile (name, bio, profile picture)
- Create posts (text, image, or video)
- Edit and delete own posts
- Comment on posts
- Like and unlike posts
- Follow and unfollow users
- View user profiles, followers, and following



### Admin

- View all users
- View all posts
- Remove inappropriate posts and comments



### UI

- Responsive design (desktop and mobile)
- Light / dark mode toggle with persistence
- System theme preference on first visit



## API Endpoints


| Module   | Endpoints                                                                      |
| -------- | ------------------------------------------------------------------------------ |
| Auth     | `POST /api/auth/register`, `POST /api/auth/login`, `GET/PUT /api/auth/profile` |
| Users    | `GET /api/users/:id`, `GET /api/users/:id/posts`, follow endpoints             |
| Posts    | `GET/POST /api/posts`, `PUT/DELETE /api/posts/:id`                             |
| Comments | `GET/POST /api/posts/:id/comments`, `DELETE /api/comments/:id`                 |
| Likes    | `POST/DELETE /api/posts/:id/like`                                              |
| Upload   | `POST /api/upload/image`, `POST /api/upload/video`                             |
| Admin    | `GET /api/admin/users`, `GET /api/admin/posts`, delete endpoints               |




