# 🚲 Two-Wheeler Service System (MERN Stack)

A role-based service management web application built using the MERN stack that allows **Users** to book bike services, **Admins** to manage bookings and mechanics, and **Mechanics** to update service status.  
The system ensures smooth coordination between all roles through a clean workflow and secure authentication.

---

## 📌 Features

### 👤 User
- Register & Login (JWT Authentication)
- Book a bike service
- View booking history
- Track service status (Pending → Assigned → In Progress → Completed)
- Update personal profile

### 🛠️ Mechanic
- Login to access mechanic dashboard
- View assigned bookings
- Update service status, remarks & cost

### 👨‍💼 Admin
- Manage all bookings
- Assign mechanics to services
- Create, update, delete mechanics
- View all users & system data

---

## 🏗️ Tech Stack

### **Frontend**
- React.js
- Axios
- React Router
- Context API (Authentication State)

### **Backend**
- Node.js
- Express.js
- JSON Web Token (JWT)
- Bcrypt.js

### **Database**
- MongoDB
- Mongoose

---

## 📂 Folder Structure (Simplified)

```
two-wheeler-service-system/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/api.js
│   │   └── App.js
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/db.js
│   └── index.js
│
└── package.json
```

---

## 🔐 Authentication Flow

1. Users log in with email & password  
2. Server validates credentials and generates JWT  
3. Token stored in AuthContext  
4. All protected routes use `ProtectedRoute.jsx` and `authMiddleware`  

---

## 🚀 How to Run the Project

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/two-wheeler-service-system.git
cd two-wheeler-service-system
```

### **2. Install Dependencies**

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd server
npm install
```

---

### **3. Configure Environment Variables**

Create a `.env` file inside **server**:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

### **4. Start the Project**

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
cd client
npm start
```

---
