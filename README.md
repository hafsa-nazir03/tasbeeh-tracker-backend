# 📿 Tasbeeh Tracker — Backend

REST API powering the Tasbeeh Tracker app — handles user authentication and manages Tasbeeh (dhikr) records with secure, token-based access.

---

## 🚀 Backend Overview

Built with **Node.js** and **Express**, this API provides:
- Secure signup/login with hashed passwords
- JWT-based authentication for protected routes
- Full CRUD support for Tasbeeh records
- MongoDB Atlas as the persistent data store
- Deployed as a serverless function on Vercel

---

## ✨ API Features

- 🔐 User Signup & Login
- 🔑 JWT token generation & verification middleware
- 🙋 Get logged-in user's profile
- 📿 Create, read, update, and delete Tasbeeh entries
- 🛡️ Ownership checks — users can only modify/delete their own custom Tasbeehs (default Tasbeehs are shared/read-protected)
- 🌐 CORS-enabled for cross-origin requests from the frontend

---

## 🛠️ Technologies Used

- **Node.js**
- **Express 5**
- **MongoDB Atlas** with **Mongoose**
- **JWT (jsonwebtoken)** for authentication
- **bcrypt** for password hashing
- **dotenv** for environment variable management
- **Vitest + Supertest** for testing
- **Vercel** (Hosting/Deployment)

---

## 🔑 Authentication (JWT)

- On signup, passwords are hashed using **bcrypt** before being stored.
- On login, credentials are verified and a **JWT token** (valid for 1 hour) is issued.
- Protected routes require the token to be sent in the request header:
  ```
  Authorization: Bearer <your_token>
  ```
- A `verifyToken` middleware decodes and validates the token before granting access to protected routes.

---

## 🍃 MongoDB

- Database: **MongoDB Atlas** (cloud-hosted)
- ODM: **Mongoose**
- Connection is cached across serverless function invocations to avoid reconnect overhead on Vercel.
- `User` model stores `name`, `email`, and hashed `password`.

---

## 📡 API Endpoints

| Method | Endpoint         | Auth Required | Description                          |
|--------|------------------|:--------------:|---------------------------------------|
| GET    | `/`              | ❌             | Health check / welcome message        |
| POST   | `/signup`        | ❌             | Register a new user                   |
| POST   | `/login`         | ❌             | Login and receive a JWT token         |
| GET    | `/profile`       | ✅             | Get logged-in user's profile          |
| GET    | `/tasbeeh`       | ✅             | Get all Tasbeehs (default + user's own) |
| POST   | `/tasbeeh`       | ✅             | Create a new Tasbeeh                  |
| GET    | `/tasbeeh/:id`   | ✅             | Get a single Tasbeeh by ID            |
| PUT    | `/tasbeeh/:id`   | ✅             | Update a Tasbeeh (owner only)         |
| DELETE | `/tasbeeh/:id`   | ✅             | Delete a Tasbeeh (owner only)         |

---

## ⚙️ Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/hafsa-nazir03/tasbeeh-tracker-backend.git
   cd tasbeeh-tracker-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the server locally**
   ```bash
   npx nodemon server.js
   ```

4. **Run tests**
   ```bash
   npm test
   ```

---

## 🔗 Frontend Repository

🔗 **Frontend Repo:** [https://github.com/hafsa-nazir03/tasbeeh-tracker-frontend](https://github.com/hafsa-nazir03/tasbeeh-tracker-frontend)

🔗 **Live Frontend:** [https://hafsa-nazir03.github.io/tasbeeh-tracker-frontend/login.html](https://hafsa-nazir03.github.io/tasbeeh-tracker-frontend/login.html)

---

## ☁️ Deployment

- Deployed on **Vercel** as a serverless Express app.
- MongoDB connection uses connection caching (`isConnected` flag) to work reliably in a serverless environment.

**Live Backend API:** [https://tasbeeh-tracker-backend.vercel.app](https://tasbeeh-tracker-backend.vercel.app)

---

## 👩‍💻 Author

**Hafsa Nazir**
GitHub: [@hafsa-nazir03](https://github.com/hafsa-nazir03)
