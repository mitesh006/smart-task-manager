<div align="center">
  <img src="frontend/public/favicon-prismgrid.svg" alt="PrismGrid Logo" width="120" />
  <h1>PrismGrid</h1>
  <p><strong>A Full-Stack Task & Project Management App (Internship Project)</strong></p>

  <!-- Badges -->
  <p>
    <a href="#"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square" alt="Build Status"></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D%2018.0.0-blue.svg?style=flat-square" alt="Node Version"></a>
    <a href="https://reactjs.org"><img src="https://img.shields.io/badge/react-18.x-61DAFB.svg?style=flat-square" alt="React Version"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
  </p>
</div>

---

## 📑 About This Project

**PrismGrid** is a full-stack task and project management application I developed from scratch during my internship. The goal of this project was to build a unified platform for tracking project lifecycles, managing interactive Kanban boards, and facilitating team collaboration while learning modern web development practices.

---

## 🏗️ Architecture & Tech Stack

I built PrismGrid using a decoupled architecture with a modern JavaScript stack to ensure a responsive UI and a robust backend API.

### Technology Stack
- **Frontend:** React.js (Vite), Tailwind CSS v4, Context API, GSAP Animations, Axios.
- **Backend:** Node.js, Express.js, RESTful API Design.
- **Database:** MongoDB (NoSQL), Mongoose ODM.
- **Security & Auth:** JSON Web Tokens (JWT), Bcrypt.js for password hashing, HTTP-only cookies.
- **Communications:** Brevo API for automated email alerts.

---

## ✨ Key Features Developed

### Authentication & Authorization
- **Secure Onboarding:** User registration with OTP-verified email.
- **Stateful Sessions:** Implemented secure, stateless JWT tokenization using HTTP-only cookies to protect against XSS attacks.

### Project & Task Management
- **Workspace Management:** Complete CRUD operations for projects.
- **Interactive Kanban:** Drag-and-drop interfaces for task progression and state management.

### Team Collaboration
- **Task Assignment:** Ability to delegate tasks to team members.
- **Email Notifications:** Automated email alerts for invitations and task assignments.

### UI / UX
- **Analytics Dashboard:** Visual metrics for active and completed tasks.
- **Responsive Design:** Fully responsive UI with a dynamic Light/Dark mode toggle.

---

## 🚀 How to Run Locally

If you'd like to test out the project locally, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cluster)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart-task-manager
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173

# Database & Authentication
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key

# Brevo API Communications
BREVO_API_KEY=your_brevo_api_key
BREVO_FROM='your_email@domain.com'
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_BASE_API_URL=http://localhost:3000/api
```

Start the frontend development server:
```bash
npm run dev
```
You can now view the app in your browser at `http://localhost:5173`.

---

## 📂 Project Structure

```text
smart-task-manager/
├── backend/                  # Node.js API
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # API logic
│   │   ├── middlewares/      # Express middlewares (Auth, etc.)
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routes
│   │   ├── utils/            # Helper functions
│   │   └── app.js            # Express app setup
│   └── server.js             # Entry point
│
└── frontend/                 # React App
    ├── src/
    │   ├── api/              # Axios configuration
    │   ├── assets/           # Images, icons, etc.
    │   ├── components/       # Reusable React components
    │   ├── context/          # React context providers
    │   ├── pages/            # Main application views
    │   ├── utils/            # Helper functions
    │   ├── App.jsx           # Root component
    │   ├── main.jsx          # React entry point
    │   └── index.css         # Global styles & Tailwind config
    └── package.json          # Dependencies
```

---

## 📚 API Documentation

For detailed information on the REST API endpoints I created, please refer to the [API.md](docs/API.md) file.

---

## 💡 What I Learned

Building this project taught me a lot about:
- Designing and implementing RESTful APIs from scratch.
- Handling secure user authentication using JWT and HTTP-only cookies.
- Managing complex state in React and creating interactive UI components (like drag-and-drop Kanban boards).
- Integrating third-party APIs (Brevo for emails).
- Structuring a full-stack project for maintainability.

---

## 📄 License & Contact

This project was built during an internship and is available under the [MIT License](LICENSE).

Feel free to reach out if you have any questions about this project or my implementation approach!
