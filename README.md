# Team Task Manager

A premium full-stack task management application with Role-Based Access Control (RBAC).

## 🚀 Features
- **Authentication**: JWT-based Login & Signup.
- **Roles**: Admin and Member roles with different permissions.
- **Projects**: Admins can create and manage projects; Members see assigned projects.
- **Tasks**: Create, assign, and track task statuses (Todo, In Progress, Completed).
- **Dashboard**: Visual overview of task statistics and performance.
- **Premium UI**: Modern dark theme with glassmorphism and smooth animations.

## ⚙️ Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on `mongodb://localhost:27017/team-task-manager`)

### Backend
1. Go to `server` directory.
2. Run `npm install`.
3. Run `node server.js`.

### Frontend
1. Go to `client` directory.
2. Run `npm install`.
3. Run `npm run dev`.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Vanilla CSS, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT.
- **Styling**: Modern CSS Design System (no Tailwind).
