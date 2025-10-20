# **Lead Management Dashboard**

A full-stack lead management application with **Admin** and **Agent** roles, built using **MERN stack** (MongoDB, Express, React, Node.js).

* Admins can add agents, upload leads, and assign them to agents.
* Agents can log in and view their assigned leads.
* RBAC (Role-Based Access Control) ensures secure access.
* Professional dashboard with toast notifications for actions.
* Seed admin user is automatically created on server startup.

---

## **Tech Stack**

* **Frontend:** React.js, Tailwind CSS, React Hot Toast, Axios
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas (cloud-based MongoDB)
* **Authentication:** JWT (JSON Web Tokens)
* **Other Libraries:** bcryptjs, react-icons, xlsx for Excel uploads

---

## **Features**

### **Admin**

* Login & Logout
* Add agents (with email, password, phone with country code)
* View list of agents
* Upload Excel (`.xlsx`) files of leads
* View distributed leads
* Delete agents with toast confirmation
* Professional sidebar dashboard

### **Agent**

* Login & Logout
* View assigned leads only
* See leads with phone number and notes

---

## **Setup Instructions**

### **1. Clone the repository**

```bash
git clone <your-repo-url>
cd <repo-folder>
```

### **2. Install dependencies**

#### Backend:

```bash
cd backend
npm install
```

#### Frontend:

```bash
cd frontend
npm install
```

### **3. Configure Environment Variables**

Create a `.env` file in the backend root:

```
PORT=5000
MONGO_URI=<Your MongoDB Atlas connection string>
JWT_SECRET=<YourSecretKey>
```

> Make sure you use a MongoDB Atlas cluster. The app will create a **seed admin user** automatically on server startup.

---

### **4. Run the Application**

#### Backend:

```bash
cd backend
npm run dev
```

#### Frontend:

```bash
cd frontend
npm run dev
```

* Frontend will be available at `http://localhost:5173`
* Backend API will run at `http://localhost:5000/api`

---

### **5. Seed Admin Credentials**

On server startup, the following admin is automatically created:

```
Email: admin@example.com
Password: admin123
```

> This admin can log in and manage agents immediately.

---

### **6. Usage**

1. Log in as **Admin** using the seed credentials.
2. Use the **Sidebar** to:

   * Add agents
   * Upload leads (`.xlsx` files) or (`.csv`)
   * View distributed leads
3. Agents can log in using credentials created by the admin.
4. Agents will see only their assigned leads.

---

### **7. File Format for Leads Upload**

The Excel (`.xlsx`) or (`.csv`) file should have:

| FirstName | Phone      | Notes                      |
| --------- | ---------- | -------------------------- |
| John Doe  | 9998887770 | Interested in product demo |

* First row should be **column headers**
* Subsequent rows are leads

---

### **8. Notes**

* Application uses **MongoDB Atlas**, ensure you have network access enabled for your IP.
* Passwords are hashed using **bcryptjs**.
* JWT tokens handle authentication and role-based access.
