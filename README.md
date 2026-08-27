# 🌿 Beads & Duas — Backend

RESTful backend API for **Beads & Duas**, a full-stack application for managing Tasbeeh and personal Duas.

Built with **Node.js, Express.js, MongoDB, Mongoose, JWT, and bcrypt**.

---

## 🚀 Live API

**Backend:**
https://tasbeeh-tracker-backend.vercel.app

**Frontend:**
https://hafsa-nazir03.github.io/tasbeeh-tracker-frontend/

---

## ✨ Features

* 🔐 JWT-based authentication
* 🔑 Secure password hashing with bcrypt
* 👤 User registration and login
* 🛡️ Protected API routes
* 👨‍💼 Role-based authorization for admin access
* 📿 Full CRUD for Tasbeeh
* 🤲 Full CRUD for Duas
* ✅ Client and server-side validation
* 📊 Dashboard data endpoints
* ⚠️ Error handling and validation responses
* 💾 MongoDB data persistence

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB Atlas**
* **Mongoose**
* **JWT**
* **bcrypt**
* **CORS**
* **dotenv**

---

## 📡 API Endpoints

### Authentication

```text
POST /signup
POST /login
```

### Tasbeeh

```text
GET    /tasbeeh
POST   /tasbeeh
GET    /tasbeeh/:id
PUT    /tasbeeh/:id
DELETE /tasbeeh/:id
```

### Duas

```text
GET    /duas
POST   /duas
GET    /duas/:id
PUT    /duas/:id
DELETE /duas/:id
```

Protected endpoints require a valid JWT token.

---

## 🔐 Authentication

Authentication uses **JWT tokens**.

```text
Signup
  ↓
Password hashed with bcrypt
  ↓
User saved in MongoDB
  ↓
Login
  ↓
JWT generated
  ↓
Token used for protected requests
```

Admin routes additionally verify the user's role.

---

## 🗄️ Database

The backend uses **MongoDB Atlas** with Mongoose.

Main resources:

* `Users`
* `Tasbeeh`
* `Duas`

User-specific resources are associated with authenticated users so users can access their own data securely.

---

## 🧪 Testing

Automated backend tests cover core API functionality, including:

* API response
* GET requests
* Successful CRUD operations
* Missing required fields
* Invalid data
* Authentication-related cases

Testing tools include **Vitest** and **Supertest**.

The complete project also includes a **Cypress end-to-end test** for the main user flow.

---

## ⚙️ Local Setup

Clone the repository:

```bash
git clone https://github.com/hafsa-nazir03/tasbeeh-tracker-backend.git
cd tasbeeh-tracker-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000
```

Start the server:

```bash
node server.js
```

For development:

```bash
npm run dev
```

---

## ☁️ Deployment

The backend is deployed on **Vercel** and uses **MongoDB Atlas** as the production database.

Production secrets such as the MongoDB connection string and JWT secret are stored as environment variables and are not committed to the repository.

---


# 👩‍💻 Author

**Hafsa Nazir**

---
