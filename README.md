NIA – Neural Intelligence Assistant (Task Manager)

Student Project – INFS 202 Midterm

Project Description

NIA is a full-stack task management web application that allows users to register, log in, and manage their personal tasks. Tasks can be created, edited, deleted, and marked as complete.

Tech Stack

Frontend
- React 19
- React Router DOM v7
- Vite
- CSS (custom, responsive)
- Framer Motion
- Deployed on Vercel

Backend
- Node.js
- Express.js
- PostgreSQL (via `pg`)
- JWT Authentication
- bcrypt password hashing
- Deployed on Render

Features

- User registration and login (JWT-based auth)
- Create, read, update, delete tasks
- Mark tasks as complete/incomplete
- Task categories and due dates
- Overdue task highlighting
- Responsive design (mobile, tablet, desktop)
- Animated particle background

Project Structure

```
task-manager/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ManaParticles.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── List.jsx
│   │   │   ├── Detail.jsx
│   │   │   └── AddItem.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── backend/
    ├── routes/
    │   ├── auth.js
    │   └── tasks.js
    ├── db.js
    ├── server.js
    └── package.json
```

Setup Instructions

Prerequisites
- Node.js v18+
- PostgreSQL database

Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```
DB_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run the database setup SQL:
```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  due_date VARCHAR(50),
  completed BOOLEAN DEFAULT false
);
```

Start the backend:
```bash
npm start
```

Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file:
```
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

 Live URL

- Frontend: https://task-manager-d2fe.vercel.app
- Backend API: https://task-manager-1-zlxf.onrender.com

API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Toggle complete |
| PATCH | /api/tasks/:id | Edit task |
| DELETE | /api/tasks/:id | Delete task |
