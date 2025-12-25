# User & Admin Authentication with Role-Based Access (Node.js + Express + MongoDB)

A simple and beginner-friendly authentication system supporting:

- User registration
- Login using JWT authentication
- Role-based access control (RBAC)
- Separate dashboards for **Admin** and **User**
- Pre-seeded Admin account
- Task system with ownership
- EJS templating
- MongoDB as the database

---

## Features

### Authentication

- Register new users with **name, email, password**
- Hash passwords securely using **bcrypt**
- Login using JWT token
- Role included in JWT payload

### Role-Based Access

- **Admin Dashboard:** View all tasks
- **User Dashboard:** View only tasks belonging to logged-in user
- Middleware-based access control (auth + role)

### Tasks

- Tasks are pre-populated using a seed script
- Each task belongs to a user via `userId`

### Tech Stack

- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT + bcrypt
- **Templating:** EJS
- **Styling:** CSS (public folder)

---

## Project Structure

```
auth-rbac-project/
│
├── server.js                    # Main Express server
├── README.md                    # Documentation
│
├── .env                         # Environment variables
│
├── init/
│   ├── db.js                   # MongoDB connection
│   └── seed.js                 # Database seeding script
│
├── models/
│   ├── User.js                 # User schema
│   └── Task.js                 # Task schema
│
├── middleware/
│   ├── auth.js                 # JWT verification
│   └── role.js                 # Role-based access control
│
├── routes/
│   ├── authRoutes.js           # Authentication endpoints
│   └── dashboardRoutes.js      # Dashboard endpoints
│
├── views/
│   ├── login.ejs               # Login page
│   ├── register.ejs            # Registration page
│   ├── user.ejs                # User dashboard
│   └── admin.ejs               # Admin dashboard
│
└── public/
    └── styles.css              # Global stylesheet
```

---

## Installation & Setup

### Clone the repository

```bash
git clone <your-repo-link>
cd auth-rbac-project
```

### Install dependencies

```bash
npm install
```

### Create .env file

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/auth_rbac_db
JWT_SECRET=supersecretkey123
```

### Seed the database

```bash
node init/seed.js
```

Admin credentials:

```
Email: admin@hyperverge.co
Password: admin123
```

User credentials:

```
Email: user@test.com
Password: 123456
```

### Start the server

```bash
npm start
or
npm server.js
or
nodemon server.js
```

Visit: `http://localhost:5000`

---

## API Endpoints

### POST /auth/register

Registers a new user.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "message": "User registered successfully"
}
```

### POST /auth/login

Logs in a user and returns a JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "<jwt_token>",
  "role": "user"
}
```

### GET /dashboard/user

Requires valid JWT token. Returns tasks for the logged-in user.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "tasks": [
    {
      "_id": "...",
      "title": "User Task 1",
      "description": "Complete assignment",
      "userId": "..."
    }
  ]
}
```

### GET /dashboard/admin

Requires valid JWT token with `admin` role. Returns all tasks.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "tasks": [
    {
      "_id": "...",
      "title": "Admin Task 1",
      "description": "Review submissions",
      "userId": { "email": "admin@hyperverge.co" }
    }
  ]
}
```

---

## Admin Credentials

| Field    | Value               |
| -------- | ------------------- |
| Email    | admin@hyperverge.co |
| Password | admin123            |

---

## Core Components

### Models

#### User.js

- **name:** User's full name
- **email:** Unique email address
- **password:** Hashed using bcrypt
- **role:** "admin" or "user" (default: "user")
- **createdAt:** Timestamp

#### Task.js

- **title:** Task name
- **description:** Task details
- **userId:** Reference to User model (ObjectId)
- **createdAt:** Timestamp

### Middleware

#### auth.js

- Verifies JWT token from `Authorization` header
- Attaches decoded user info (`req.user`) to request
- Returns 401 if token is missing or invalid

#### role.js

- Checks if user's role matches required role
- Returns 403 if role doesn't match
- Used as route middleware

### Routes

#### authRoutes.js

- `/auth/register` - POST: Register new user
- `/auth/login` - POST: Login and get JWT

#### dashboardRoutes.js

- `/dashboard/user` - GET: User's tasks (requires auth + user role)
- `/dashboard/admin` - GET: All tasks (requires auth + admin role)

---

## Dashboard Views (EJS + Fetch API)

Both Admin and User dashboards are rendered using **EJS templates**. Task data is fetched from backend API endpoints using **JavaScript Fetch API**.

### Data Flow

1. User logs in → JWT token stored in `sessionStorage`
2. Dashboard page loads (EJS renders empty container)
3. Frontend JavaScript calls `/dashboard/user` or `/dashboard/admin`
4. Backend returns task data as JSON
5. Frontend dynamically renders tasks in the DOM

### Key Points

- **EJS templates receive no server-side data** — UI updates happen through frontend fetch()
- `/dashboard/user` endpoint → returns tasks belonging to the logged-in user (JSON)
- `/dashboard/admin` endpoint → returns all tasks (JSON)
- Token is sent in `Authorization: Bearer <token>` header
- Tasks are mapped to HTML using `Array.map()` and `join()`

### Example: User Dashboard Flow

```javascript
// user.ejs
const token = sessionStorage.getItem("token");
async function loadTasks() {
    const res = await fetch("/dashboard/user", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  // Dynamically render tasks
  document.getElementById("tasks").innerHTML = data.tasks
    .map((t) => `<p><strong>${t.title}</strong> — ${t.description}</p>`)
    .join("");
}

loadTasks();
```

---

## Frontend Overview

### login.ejs

- Login form with email and password
- Stores JWT token in sessionStorage
- Redirects to `/admin` for admins, `/user` for regular users
- Link to registration page

### register.ejs

- Registration form with name, email, password
- Creates new user account
- Redirects to login on success
- Link back to login page

### user.ejs

- Displays tasks belonging to logged-in user
- Fetches from `/dashboard/user` endpoint
- Logout button clears sessionStorage and redirects to login
- Shows "No tasks found" if user has no tasks

### admin.ejs

- Displays all tasks in the system
- Fetches from `/dashboard/admin` endpoint
- Shows task owner's email for each task
- Logout button clears sessionStorage and redirects to login
- Shows "No tasks found" if no tasks exist

---

## Styling

### styles.css

- **Container:** Centered white box with shadow
- **Form inputs:** Padded, bordered, rounded
- **Buttons:** Blue primary action, red logout
- **Task list:** Light blue background with left border
- **Navigation links:** Blue, underline on hover
- **Responsive:** Works on mobile and desktop

---

## Security Features

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT for secure authentication
- Role-based access control at middleware level
- CORS enabled
- Environment variables for secrets
- Token stored in sessionStorage (client-side)

---

## Deployment on Render

### Step 1: Push to GitHub

Push your project to a GitHub repository.

### Step 2: Create Render Web Service

1. Go to https://render.com
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Name your service (e.g., `auth-rbac-app`)

### Step 3: Configure Build & Start

**Build Command:**

```bash
npm install
```

**Start Command:**

```bash
npm start
```

### Step 4: Set Environment Variables

In Render dashboard, go to **Environment** and add:

```
PORT=10000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/auth_rbac_db
JWT_SECRET=your-strong-secret-key
```

### Step 5: Verify Server Configuration

Ensure your `server.js` listens on `process.env.PORT`:

```javascript
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
```

### Step 6: Deploy

- Click **Deploy** on Render dashboard
- Wait for build to complete
- Render provides a live URL: `https://your-app.onrender.com`

### Step 7: Update Frontend Fetch URLs (if needed)

If your frontend is deployed separately, update fetch URLs:

```javascript
// Before (localhost)
fetch("http://localhost:5000/dashboard/user", ...)

// After (Render)
fetch("https://your-app.onrender.com/dashboard/user", ...)
```

### Step 8: Test Live Deployment

Visit: `https://your-app.onrender.com`

- Register a new account
- Login with admin credentials
- Verify dashboards load correctly

---

## Deployment Notes

- Use **MongoDB Atlas** for cloud database
- Set environment variables on hosting platform
- Ensure server listens on `process.env.PORT`
- Update `MONGO_URI` with production database URL
- Use strong `JWT_SECRET` in production
- Keep `.env` file in `.gitignore` — never commit secrets

---
