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

## 📝 License

MIT
