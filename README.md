# 🩸 LifeLink — Blood Donation Platform

<p align="center">
  <strong>Connecting blood donors with patients through a full-stack web application.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/License-Academic%20Project-blue" alt="Academic project">
</p>

LifeLink is a full-stack blood donation platform built to help patients discover potential blood donors, submit blood requests, and follow request updates. It provides separate workflows for donors, patients, and administrators.

## Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Security Notes](#-security-notes)
- [Documentation](#-documentation)
- [Future Enhancements](#-future-enhancements)
- [Author](#-author)

## 🎯 Project Overview

Finding a suitable blood donor quickly can be challenging. LifeLink brings donor discovery and blood request coordination into one web application.

The project demonstrates a client-server architecture with a React frontend, an Express REST API, and MongoDB for persistent data storage.

## ✨ Features

- **Authentication:** registration and login workflows.
- **Role-based access:** separate donor, patient, and administrator experiences.
- **Donor discovery:** search and filter donors using blood group and city.
- **Blood requests:** submit and track requests for required blood groups.
- **Donor response workflow:** donors can respond to eligible requests.
- **Notifications:** keep users informed about relevant request updates.
- **Availability management:** donors can manage their availability.
- **Request administration:** administrative workflows for reviewing and updating request status.
- **Profile management:** user profile information and account-specific views.
- **Responsive interface:** a web UI built with React and Tailwind CSS.

Feature availability can depend on the current application configuration and user role.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Routing | React Router |
| HTTP communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, MongoDB Atlas |
| Data modelling | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password security | bcrypt |
| Version control | Git and GitHub |

## 🏗️ Architecture

```text
User
 |
 v
React Frontend (Vite)
 |
 | HTTP / Axios
 v
Express REST API
 |
 | Authentication and authorization
 v
Application Routes and Middleware
 |
 v
Mongoose Models
 |
 v
MongoDB
```

The frontend handles user interaction, the backend validates requests and applies application rules, and MongoDB stores application data.

## 📁 Project Structure

```text
LIFELINK-Blood-Donation-Platform/
├── Backend/
│   ├── middleware/
│   ├── models/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── ARCHITECTURE.md
│   └── FEATURES.md
├── .gitignore
└── README.md
```

Some local files may differ as the project evolves.

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB database, such as MongoDB Atlas
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Ayushishukla340/LIFELINK-Blood-Donation-Platform.git
cd LIFELINK-Blood-Donation-Platform
```

### 2. Install backend dependencies

```bash
cd Backend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside `Backend/`. Add the environment variables expected by the backend code, including the server port, MongoDB connection string, and JWT secret.

See [Environment Configuration](#-environment-configuration).

### 4. Start the backend

Use the start script defined in `Backend/package.json`. For example, if the project has a `dev` script:

```bash
npm run dev
```

The backend has been configured to use port `5000` in the current development setup.

### 5. Start the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local address printed by Vite, commonly `http://localhost:5173`.

Keep the backend and frontend running in separate terminals during local development.

## 🔐 Environment Configuration

Keep credentials out of source control. Typical backend configuration includes:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Use the exact variable names expected by your current backend. Never publish real database credentials, tokens, or secret keys.

## 🔒 Security Notes

- Passwords should be stored as hashes, not plain text.
- Protected API routes should validate authentication tokens.
- Administrative actions should require appropriate authorization.
- Validate user input on the server.
- Keep `.env` files out of Git commits.
- Use HTTPS and production-grade secret management when deploying.

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Feature Guide](docs/FEATURES.md)

## 🔮 Future Enhancements

- AI-assisted donor recommendations.
- Blood demand forecasting.
- Hospital and blood-bank integration.
- Deployment with a public demo URL.
- Expanded automated testing and monitoring.

These are proposed enhancements and should not be interpreted as already implemented.

## 👩‍💻 Author

**Ayushi Shukla**
B.Tech — Computer Science and Engineering (Artificial Intelligence)
Babu Banarasi Das University, Lucknow

- GitHub: [@Ayushishukla340](https://github.com/Ayushishukla340)

---

<p align="center">
  Built as an academic full-stack project to support blood donation coordination.
</p>