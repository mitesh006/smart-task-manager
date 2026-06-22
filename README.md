# TaskFlow: Smart Task Manager

TaskFlow is a premium, cinematic task management application designed for individuals and teams. It provides a luxurious "dark-mode first" aesthetic paired with robust project and task tracking capabilities.

## 🚀 Core Features

- **User Registration & Login**: Secure account creation with email OTP verification.
- **JWT Authentication**: Secure, stateful sessions using HTTP-only cookies and JSON Web Tokens.
- **Project CRUD Operations**: Create workspaces, invite members, and manage project lifecycles.
- **Task Management System**: Interactive Kanban board with drag-and-drop functionality for seamless task tracking.
- **Team Collaboration Module**: Assign tasks, manage project members, and instantly trigger email assignments.
- **Automated Email Alerts**: Real-time SMTP integrations for project invitations, task assignments, and 24-hour due date alerts.
- **Dashboard Analytics**: Personal metrics dashboard aggregating active, completed, and overdue tasks.
- **Responsive UI Design**: Built with Tailwind CSS, adapting smoothly across modern desktop viewports.
- **Dark/Light Theme Toggle**: Full dynamic theme routing built directly into CSS variables for optimal readability.

## 🛠 Technical Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS v4** (Custom Design System & Utilities)
- **Lucide React** (Icons)
- **GSAP** (Cinematic Animations & Micro-interactions)
- **React Router** (Client-side routing)
- **Axios** (API communication)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & ODM)
- **JSON Web Tokens (JWT)** (Authentication)
- **Bcryptjs** (Password hashing)
- **Nodemailer** (SMTP Email Integration)

## 📁 Clean Folder Structure

The repository follows a clean MVC architectural pattern on the backend and a modular component system on the frontend.

\`\`\`
smart-task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handling & business logic
│   │   ├── models/        # Mongoose database schemas
│   │   ├── routes/        # Express API routing
│   │   ├── middlewares/   # Auth & error protection layers
│   │   └── utils/         # Mailer, templates, and cron jobs
│   └── server.js          # Entry point
│
└── frontend/
    ├── src/
    │   ├── api/           # Axios instance configuration
    │   ├── components/    # Reusable UI elements (Modals, Dialogs)
    │   ├── context/       # React Context providers (AuthContext)
    │   ├── pages/         # Full route views
    │   ├── index.css      # Design System & Tailwind Directives
    │   └── App.jsx        # Routing configuration
    └── package.json
\`\`\`

## 🔒 Validation & Security

- **Secure Passwords**: All passwords are cryptographically hashed via `bcryptjs` before entering the database.
- **Protected Routes**: The `protectRoute` Express middleware intercepts unauthorized API requests.
- **Client-Side Validation**: Forms enforce required fields, email formatting, and password matching before submission.
- **Error Handling**: API endpoints are wrapped in robust `try/catch` blocks, parsing backend errors into standardized, user-friendly Toast notifications.

## ⚙️ Installation & Local Setup

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd smart-task-manager
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend/` directory:
\`\`\`env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
FRONTEND_URL=http://localhost:5173
\`\`\`
Start the development server:
\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
\`\`\`
Start the Vite development server:
\`\`\`bash
npm run dev
\`\`\`

## 📝 License
This project is licensed under the MIT License.
