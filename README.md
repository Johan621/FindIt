# FindIt

FindIt is a modern, full-stack lost-and-found platform designed to reconnect people with their missing belongings. Built with a focus on simplicity, performance, and modern aesthetics, it helps communities report, search, and track lost items from one centralized dashboard.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT and bcrypt.
- **Quick Reporting**: Submit lost or found items in seconds with photos, detailed locations, categories, and clear status updates.
- **Advanced Search & Filtering**: Filter items by category, type, and status to narrow down matches quickly and efficiently.
- **Real-Time Tracking & Statistics**: Stay updated with a clean dashboard to track new reports and view system statistics (e.g., pending items, recovered items) visualized with interactive charts.
- **Notifications System**: View recent notifications regarding your reported items and matches.
- **Modern UI/UX**: A responsive, dark-mode first interface designed with Tailwind CSS to feel premium, featuring glassmorphism, dynamic gradients, and fluid animations.

## 🛠️ Tech Stack

**Frontend:**
- React 19 (via Vite)
- Tailwind CSS (Styling & Animations)
- React Router (Client-side Routing)
- Recharts (Data Visualization)
- Axios (API Networking)
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js (REST API)
- MongoDB & Mongoose (Database & ORM)
- JSON Web Tokens (JWT) (Authentication)
- bcryptjs (Password Hashing)
- MongoDB Memory Server (Local development database fallback)

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Johan621/FindIt----Campus-things-lost-and-found.git
   cd FindIt----Campus-things-lost-and-found
   ```

2. Install dependencies for both the frontend and the backend server:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../server
   npm install
   ```

### Running the Application

To run the application locally, you will need two separate terminal windows. The backend is configured to use a local, in-memory MongoDB instance for development, meaning no database setup is required!

**Terminal 1: Start the Backend**
```bash
cd server
npm start
```
*(The backend API will run on `http://localhost:5000`)*

**Terminal 2: Start the Frontend**
```bash
cd frontend
npm run dev
```
*(The frontend will be available at `http://localhost:5173`)*

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 🚀 Deployment

### Backend on Render

1. Create a new Render Web Service from this repository.
2. Set the root directory to `server`.
3. Use `npm install` as the build command.
4. Use `npm start` as the start command.
5. Add these environment variables in Render:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = a long random secret
   - `NODE_ENV` = `production`
6. Deploy and copy the Render service URL, for example `https://your-service.onrender.com`.

### Frontend on Vercel

1. Create a new Vercel project from this repository.
2. Set the root directory to `frontend`.
3. Use `npm run build` as the build command.
4. Set the output directory to `dist`.
5. Add this environment variable in Vercel:
   - `VITE_API_URL` = `https://your-service.onrender.com/api`
6. Deploy the frontend and open the Vercel URL.

### Why login/register fail after deployment

The frontend API client falls back to `http://localhost:5000/api` when `VITE_API_URL` is not set. That works locally, but after deploying to Vercel it points to the user’s machine instead of the Render backend, so auth requests fail.

## 📝 Notes

- The backend can start with an in-memory MongoDB fallback for local development, but production deployments should use MongoDB Atlas through `MONGO_URI` so data persists.

## 📝 License

MIT
