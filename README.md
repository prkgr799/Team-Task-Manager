# Team Task Manager

A premium full-stack task management application with Role-Based Access Control (RBAC).

## 🚀 Features
- **Authentication**: JWT-based Login & Signup.
- **Roles**: Admin and Member roles with different permissions.
- **Projects**: Admins can create and manage projects; Members see assigned projects.
- **Tasks**: Create, assign, and track task statuses (Todo, In Progress, Completed).
- **Dashboard**: Visual overview of task statistics and performance.
- **Premium UI**: Modern dark theme with glassmorphism and smooth animations.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Lucide Icons, Axios.
- **Backend**: Node.js, Express, NeDB (NoSQL).
- **Auth**: JWT, BcryptJS.

## ⚙️ Deployment Instructions (Railway)

1. **Root Directory**: Ensure you are deploying from the root of the project.
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**:
   - `JWT_SECRET`: Any random string for token encryption.
   - `NODE_ENV`: Set to `production`.
   - `MONGODB_URI`: (Optional) Provide a MongoDB Atlas string for persistent storage.

## 🖥️ Local Setup

1. Run `npm run install:all` in the root directory.
2. Run `npm run dev` to start both frontend and backend.
