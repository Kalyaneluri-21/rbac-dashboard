# RBAC Dashboard Application

## 🚀 Project Overview

This is a **Role-Based Access Control (RBAC) Dashboard Application** built using **Next.js and MongoDB**.

The system supports three roles:

* **Super Admin**
* **Admin**
* **User**

Each role has different permissions and access levels, ensuring secure and structured data management.

---

## 🛠 Tech Stack

* **Frontend & Backend:** Next.js (App Router)
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT (jsonwebtoken)
* **Password Security:** bcryptjs
* **Styling:** Tailwind CSS

---

## 🔐 Authentication

* Single login using **email & password**
* Passwords are securely hashed using bcrypt
* JWT token is generated after login
* Role-based redirection:

  * Super Admin → `/super-admin`
  * Admin → `/admin`
  * User → `/user`

---

## 👥 Roles & Permissions

### 👑 Super Admin

* Create, view, update, delete **Admins**
* Create, view, update, delete **Users**
* Can access all data

---

### 🛠 Admin

* Create, view, update, delete **Users created by them**
* Cannot access other admins or their users

---

### 👤 User

* Login and access personal dashboard
* Perform CRUD operations on **Tasks**

---

## 📦 Features

### ✅ Authentication

* Secure login with JWT
* Role-based access control

---

### ✅ Admin Management (Super Admin)

* Create Admin
* View all Admins
* Update Admin
* Delete Admin

---

### ✅ User Management

* Super Admin → manage all users
* Admin → manage only their users

---

### ✅ Task Management (User)

* Create Task
* View Tasks
* Update Task (title, description, status)
* Delete Task

---

## 📁 Project Structure

```
src/
 ├── app/
 │   ├── api/
 │   │   ├── auth/
 │   │   ├── admin/
 │   │   ├── user/
 │   │   ├── task/
 │   │   
 │   ├── login/
 │   ├── super-admin/
 │   ├── admin/
 │   └── user/
 │
 ├── lib/
 │   └── db.js
 │
 ├── models/
 │   ├── User.js
 │   └── Task.js
 │
 └── middleware/
     └── auth.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-link>
cd <project-folder>
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create `.env.local`

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

### 4. Run the project

```bash
npm run dev
```

---

## 🧪 Initial Setup (Super Admin)

The application automatically creates a Super Admin when the database connects for the first time.

This is handled inside: src/lib/db.js

No manual API call is required.

---

## 🌐 Deployment   

The application is deployed using Vercel.

Live URL:
rbac-dashboard-sand.vercel.app

Backend APIs are handled using Next.js server functions, and MongoDB Atlas is used as the cloud database.

---

## 🔑 Test Credentials

```
Super Admin:
Email: superadmin@gmail.com
Password: 123456
```

(You can create Admins and Users from dashboard)

---

## 🧠 Approach

* Used **Next.js App Router** to handle both frontend and backend
* Implemented **JWT-based authentication**
* Applied **role-based access control (RBAC)** on APIs
* Designed **modular APIs** for scalability
* Ensured **secure password handling**
* Built minimal UI focusing on functionality

---

## ✨ Bonus Implementations

* JWT Authentication
* Route Protection
* Role-based API validation
* Clean folder structure
* Reusable components
* Task CRUD module

---

## ⚠️ Notes

* Super Admin is created automatically on first DB connection
* No public seed API is exposed (improves security)

---

## 📌 Conclusion

This project demonstrates:

* Full-stack development using Next.js
* Secure authentication and authorization
* Clean and maintainable code structure
* Proper implementation of RBAC system

---

## 🙌 Author

Kalyana Chakravarthi Eluri

