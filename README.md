<div align="center">
  <h1>🔍 FindIt</h1>
  <p>A modern, full-stack lost-and-found platform designed to reconnect people with their missing belongings.</p>
</div>

---

## 📖 About FindIt

FindIt is built with a focus on simplicity, performance, and modern aesthetics. It helps communities report, search, and track lost items from one centralized dashboard. Whether you've lost something precious or found an item and want to return it to its rightful owner, FindIt makes the process seamless and efficient.

## ✨ Features

- **User Authentication**: Secure registration, login, and password reset workflows using JWT and bcrypt.
- **Quick Reporting**: Submit lost or found items in seconds with image uploads (via Cloudinary), detailed locations (interactive maps), categories, and status updates.
- **Advanced Search & Filtering**: Filter items by category, type, and status to narrow down matches quickly and efficiently.
- **Real-Time Tracking & Statistics**: Stay updated with a clean dashboard to track new reports and view system statistics visualized with interactive charts (Recharts).
- **Messaging System**: Direct messaging between finders and owners to coordinate item returns securely.
- **Notifications System**: View recent notifications regarding your reported items and potential matches via email (Nodemailer) and in-app alerts.
- **Admin Panel**: Dedicated dashboard for administrators to manage reports, users, and oversee platform activity.
- **Modern UI/UX**: A responsive, dark-mode first interface designed with Tailwind CSS to feel premium, featuring glassmorphism, dynamic gradients, fluid animations, and robust theming.

## 🛠️ Tech Stack

### Frontend
- **React 19** (via **Vite**) - Fast and modern UI library
- **Tailwind CSS v4** - Styling & responsive design
- **React Router DOM** - Client-side routing
- **React Leaflet** - Interactive maps for location tracking
- **Recharts** - Data visualization and dashboard charts
- **Axios** - API Networking
- **Lucide React** - Beautiful, consistent iconography

### Backend
- **Node.js & Express.js** - Robust RESTful API framework
- **MongoDB & Mongoose** - Database & Object Data Modeling (ODM)
- **JSON Web Tokens (JWT)** - Secure stateless authentication
- **BcryptJS** - Password hashing
- **Multer & Cloudinary** - Image uploading and cloud storage
- **Nodemailer** - Email service integration
- **MongoDB Memory Server** - Local development database fallback

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Johan621/FindIt.git
   cd FindIt
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd ../server
   npm install
   ```

### Running Locally

To run the application locally, you will need two separate terminal windows. The backend is configured to use a local, in-memory MongoDB instance for development, meaning no database setup is strictly required to test it out!

**Terminal 1: Start the Backend**
```bash
cd server
npm start
# or use npm run dev for nodemon
```
*(The backend API will run on `http://localhost:5000`)*

**Terminal 2: Start the Frontend**
```bash
cd frontend
npm run dev
```
*(The frontend will be available at `http://localhost:5173`)*

---

## 🌍 Environment Variables

For full functionality (especially in production), create a `.env` file in the `server` directory and configure the following variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

---

## 📦 Deployment

### Backend (Render)
1. Create a new Web Service on [Render](https://render.com/).
2. Connect your GitHub repository and set the root directory to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add your Environment Variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, etc.).
6. Deploy!

### Frontend (Vercel)
1. Create a new project on [Vercel](https://vercel.com/).
2. Connect your GitHub repository and set the root directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add Environment Variable: `VITE_API_URL` pointing to your deployed Render backend (e.g., `https://your-backend.onrender.com/api`).
6. Deploy!

> **Note on Authentication after Deployment:** If login/register fails in production, ensure `VITE_API_URL` is correctly set in your frontend hosting environment. Otherwise, it defaults to `http://localhost:5000/api`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
If you have a major change in mind, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License.
