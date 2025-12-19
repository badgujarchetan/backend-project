# 🚀 Project Management System – Backend API

A **production-grade backend API** for the ** Project Management System**, built with **Node.js, Express, and MongoDB**.  
This system is designed to handle **secure authentication, role-based access, and scalable user management** following real-world industry practices.

---

## 🌟 Overview

The **Project Management System** provides a robust backend foundation for managing users, authentication flows, and secure access control.  
The architecture focuses on **scalability, maintainability, and security**, making it suitable for real production environments.

---

## 🔐 Core Features

- Secure User Registration with Email Verification  
- JWT-based Authentication (Access & Refresh Tokens)  
- Token Rotation & Refresh Strategy  
- Protected Routes with Middleware-based Authorization  
- Forgot & Reset Password Flow  
- Change Current Password for Logged-in Users  
- Get Current Authenticated User  
- Secure Logout with Token Invalidation  
- Request Validation using `express-validator`  
- Centralized Error Handling & Standard API Responses  
- Clean and Scalable Project Structure  

---

## 🧱 Architecture & Design Principles

- **MVC Pattern** for clean separation of concerns  
- **Middleware-driven security** (Auth, Validation, Error handling)  
- **Reusable utilities** for responses, errors, and async handling  
- **Environment-based configuration** for flexible deployments  
- **Production-safe coding standards**  

---

## 🛠️ Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT (Access & Refresh Tokens)  
- **Validation:** express-validator  
- **Security:** bcrypt, crypto  
- **Email:** Nodemailer / Mailgen  

---

🧪 Production-Ready Practices Used

Secure password hashing

Token expiration handling

Refresh token storage & validation

Centralized error responses

Environment-based configurations

Clean and maintainable codebase

## 📁 Project Structure

src/
├── controllers/
│ └── auth_controller.js
├── middlewares/
│ ├── auth_middlewares.js
│ └── validator_middlewares.js
├── models/
│ └── user_model.js
├── routes/
│ └── auth_routes.js
├── utils/
│ ├── api-error.js
│ ├── api-response.js
│ ├── async-handler.js
│ └── mail.js
├── validators/
│ └── index.js
├── app.js
└── server.js


## 🔄 Authentication Flow


Register → Email Verification → Login
→ Access Token + Refresh Token
→ Protected APIs
→ Refresh Token → New Access Token



---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/your-database-name

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

CLIENT_URL=http://localhost:5173

`
