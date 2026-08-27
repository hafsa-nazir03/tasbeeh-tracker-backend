# 🌿 Beads & Duas — Tasbeeh & Dua Tracker

> A full-stack web application designed to help users track their daily Tasbeeh, save and manage Duas, and maintain their spiritual routine through a simple, peaceful, and distraction-free interface.

**Capstone Project — Full-Stack Production App**
Built as part of the Full Stack Web Development Internship at **Neurofive Solutions**.

---

## 🌙 Live Application

**Frontend:**
 https://hafsa-nazir03.github.io/tasbeeh-tracker-frontend/

**Backend API:**
https://tasbeeh-tracker-backend.vercel.app

**Frontend Repository:**
https://github.com/hafsa-nazir03/tasbeeh-tracker-frontend.git

**Backend Repository:**
https://github.com/hafsa-nazir03/tasbeeh-tracker-backend.git

---

## 📖 About the Project

**Beads & Duas** is a full-stack Tasbeeh and Dua tracking application created to solve a simple problem: keeping daily Tasbeeh records and personal Duas organized in one convenient place.

Instead of using separate tools for counting Tasbeeh and saving Duas, users can manage both through one application.

The project includes:

* User authentication and authorization
* Personal Tasbeeh management
* Dua management
* Protected user pages
* Admin dashboard
* Dashboard statistics and charts
* Secure password handling
* MongoDB data persistence
* Client-side and server-side validation
* Responsive UI
* Loading, error, and empty states
* Automated frontend, backend, and end-to-end testing

---

# ✨ Key Features

## 🔐 Authentication & Authorization

* User registration
* Secure login
* Password hashing using bcrypt
* JWT-based authentication
* Protected routes
* Token-based session handling
* Logout functionality
* Role-based access control
* Separate admin access
* Unauthorized users cannot access protected resources

---

## 📿 Tasbeeh Tracker

Users can create and manage their Tasbeeh records.

### Features

* Create a Tasbeeh
* View Tasbeeh records
* Update Tasbeeh
* Delete Tasbeeh
* Set a target count
* Select Tasbeeh category
* Track progress
* Personal user-specific data

---

## 🤲 Dua Tracker

Users can save and manage their personal Duas.

### Features

* Add a Dua
* View saved Duas
* Update a Dua
* Delete a Dua
* Add Dua title
* Save Dua text
* Categorize Duas
* Empty state when no Duas exist
* Loading state while fetching data
* Error handling for failed requests

---

## 📊 Dashboard & Data Visualization

The dashboard provides a visual overview of user data.

### Visualizations include:

* Tasbeeh statistics
* Category-based data
* Doughnut chart
* Bar chart
* Summary/stat cards

Charts are dynamically generated from backend data rather than using static values.

---

## 👨‍💼 Admin Dashboard

The application includes a separate admin view for administrative functionality.

Admin access is protected through role-based authorization.

The admin dashboard can provide an overview of registered users and application data without exposing normal user functionality to unauthorized users.

---

# 🛠️ Tech Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* Chart.js
* Responsive CSS
* GitHub Pages

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* CORS
* dotenv

## Testing

* Vitest
* Supertest
* Cypress
* End-to-End Testing

## Deployment

* GitHub Pages — Frontend
* Vercel — Backend
* MongoDB Atlas — Database

---

# 📄 Application Pages

The application contains multiple distinct views:

| Page                  | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| 🏠 Index              | Introduces Beads & Duas and its features        |
| 🔑 Login              | Authenticates existing users                    |
| 📝 Signup             | Creates a new user account                      |
| 📿 Tasbeeh Tracker     | Creates and manages Tasbeeh records             |
| 🤲 Duas Tracker       | Saves and manages personal Duas                 |
| 📊 Dashboard          | Displays user statistics and charts             |
| 👨‍💼 Admin Dashboard    | Provides protected administrative functionality |

---

# 🔄 CRUD Operations

The application implements full CRUD functionality for two main resources.

## Tasbeeh Resource

```text
CREATE → Add a new Tasbeeh
READ   → View Tasbeeh records
UPDATE → Edit a Tasbeeh
DELETE → Remove a Tasbeeh
```

## Dua Resource

```text
CREATE → Add a new Dua
READ   → View saved Duas
UPDATE → Edit a Dua
DELETE → Remove a Dua
```

All records are persisted in MongoDB.

---

# ✅ Validation & Application States

The application implements validation on both the frontend and backend.The backend validates incoming data before saving it to MongoDB.This prevents invalid or incomplete data from bypassing frontend validation.

---

# 🧪 Testing Strategy

Testing was implemented across the application to verify both individual functionality and complete user flows.

## Frontend Tests

Frontend tests cover important interactions and validation scenarios such as:

* Form rendering
* Empty field validation
* Invalid target validation
* Category validation
* Valid form submission
* API request triggering

## Backend Tests

Backend tests cover API behavior including:

* Root API response
* GET Tasbeeh endpoint
* Successful POST request
* Missing required fields
* Invalid target values
* API failure cases

## End-to-End Testing

Cypress is used to test the complete user flow.

Example flow:

```text
Login
  ↓
Access protected page
  ↓
Create Tasbeeh
  ↓
Submit form
  ↓
Verify saved record
```
---

# 🚀 Local Setup

## 1. Clone the Frontend

```bash
git clone https://github.com/hafsa-nazir03/tasbeeh-tracker-frontend.git
cd tasbeeh-tracker-frontend
```

Open the frontend using a local development server such as VS Code Live Server.

---

## 2. Clone the Backend

```bash
git clone https://github.com/hafsa-nazir03/tasbeeh-tracker-backend.git
cd tasbeeh-tracker-backend
```

Install dependencies:

```bash
npm install
```

---

## 3. Start the Backend

```bash
node server.js
```

For development:

```bash
npm run dev
```

The backend will run locally on the configured port.

---

# 📝 Case Study

## The Problem

Managing daily Tasbeeh and personal Duas can become inconvenient when these activities are kept in different places.

The goal of Beads & Duas was to create one simple application where users can track their Tasbeeh and save their Duas while keeping their personal records protected.

---

## Why These Technologies?

### HTML, CSS & JavaScript

Vanilla frontend technologies were used to build a lightweight and responsive interface without introducing unnecessary framework complexity.

### Node.js & Express.js

Express provides a simple structure for building REST APIs and handling authentication, validation, and CRUD operations.

### MongoDB & Mongoose

MongoDB was selected because the application's user, Tasbeeh, and Dua data can be stored naturally as documents. Mongoose provides schema validation and easier database interaction.

### JWT

JWT provides token-based authentication for protected API routes.

### bcrypt

bcrypt is used to securely hash user passwords before storing them.

### Chart.js

Chart.js was selected to create interactive visualizations for the dashboard.

### Vitest, Supertest & Cypress

Different testing tools were used to verify frontend behavior, backend API endpoints, and complete end-to-end user flows.

---

# 🧩 Major Challenge & Solution

## Challenge: Production Backend & Database Connection

One of the major challenges during development was making the backend work correctly after deployment.

The application worked locally but production requests could fail when the backend could not establish or maintain the MongoDB connection correctly.

### Solution

The backend database connection was improved by:

* Creating a dedicated database connection function
* Managing the connection state
* Configuring MongoDB connection options
* Using environment variables for production credentials
* Ensuring the database connection is available before processing requests
* Configuring MongoDB Atlas network access for the deployed backend

This made the application more reliable in the production environment.

---


# 👩‍💻 Author

**Hafsa Nazir**

---

