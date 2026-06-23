<div align="center">
  <img src="frontend/public/favicon-prismgrid.svg" alt="PrismGrid Logo" width="120" />
  <h1>PrismGrid Enterprise</h1>
  <p><strong>Intelligent Project Orchestration & Team Collaboration Platform</strong></p>

  <!-- Badges -->
  <p>
    <a href="#"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square" alt="Build Status"></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D%2018.0.0-blue.svg?style=flat-square" alt="Node Version"></a>
    <a href="https://reactjs.org"><img src="https://img.shields.io/badge/react-18.x-61DAFB.svg?style=flat-square" alt="React Version"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
    <a href="#"><img src="https://img.shields.io/badge/security-audited-success.svg?style=flat-square" alt="Security"></a>
  </p>
</div>

---

## 📑 Executive Summary

**PrismGrid** is an enterprise-grade task and project management ecosystem designed to refract workplace complexity into a structured spectrum of actionable clarity. Engineered with scalability and performance in mind, PrismGrid provides organizations with a unified platform for project lifecycles, interactive Kanban boards, and real-time team collaboration, all protected by industry-standard security protocols.

---

## 🏗️ Enterprise Architecture

PrismGrid employs a robust, decoupled architecture utilizing a modern technology stack to ensure high availability, maintainability, and rapid iteration.

### Technology Stack
- **Frontend (Client Tier):** React.js (Vite), Tailwind CSS v4, Context API, GSAP Animations, Axios.
- **Backend (API Tier):** Node.js, Express.js, RESTful Architecture.
- **Data Tier:** MongoDB (NoSQL), Mongoose ODM.
- **Security & Auth:** JSON Web Tokens (JWT), Bcrypt.js password hashing, HTTP-only cookie strategy.
- **Communications:** Nodemailer (SMTP) for automated transactional alerts.

---

## ✨ Core Capabilities

### Identity & Access Management (IAM)
- **Secure Onboarding:** Role-based access control (RBAC) ready architecture with OTP-verified email registration.
- **Stateful Sessions:** Stateless JWT tokenization securely stored in HTTP-only cookies to mitigate XSS and CSRF vectors.

### Project & Task Orchestration
- **Workspace Management:** Complete CRUD lifecycles for organizational projects.
- **Interactive Kanban:** Fluid drag-and-drop interfaces for lifecycle progression and state management.
- **Real-Time Synchronization:** Instant updates across team dashboards.

### Collaborative Ecosystem
- **Team Assignment:** Granular task delegation with automated workflow triggers.
- **Proactive Alerts:** SMTP-integrated notifications for invitations, task assignments, and SLA-critical 24-hour due date alerts.

### Observability & UI/UX
- **Analytics Dashboard:** Aggregated metrics for active, completed, and critical path tasks.
- **Adaptive Interface:** Fully responsive design system with a dynamic Light/Dark mode implementation driven by native CSS variables.

---

## 🛡️ Security & Compliance

Security is a fundamental design principle of PrismGrid, not an afterthought.
- **Cryptographic Hashing:** All credential storage utilizes salt and hash algorithms (`bcryptjs`).
- **Middleware Protection:** Deep route inspection via the `protectRoute` Express middleware intercepts unauthenticated API transactions.
- **Input Sanitization:** Client-side and server-side validation layers enforce strict schema compliance and mitigate injection vulnerabilities.

---

## 🚀 Getting Started

Follow these instructions to provision a local development environment.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cluster)
- [Git](https://git-scm.com/)

### 1. Repository Initialization
Clone the repository to your local workstation:
```bash
git clone <repository-url>
cd smart-task-manager
```

### 2. Backend Provisioning
Navigate to the backend service and install dependencies:
```bash
cd backend
npm install
```

Configure environment variables. Create a `.env` file in the `backend/` directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database & Authentication
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key

# SMTP Communications
EMAIL_USER=your_corporate_email@domain.com
EMAIL_PASS=your_smtp_app_password
```

Initialize the backend service:
```bash
npm run dev
```

### 3. Frontend Provisioning
Open a new terminal session and navigate to the frontend service:
```bash
cd frontend
npm install
```

Initialize the client application:
```bash
npm run dev
```
Access the platform via `http://localhost:5173`.

---

## 📂 Repository Structure

The codebase strictly adheres to the Model-View-Controller (MVC) paradigm on the server and a component-driven architecture on the client.

```text
smart-task-manager/
├── backend/                  # API Microservice
│   ├── src/
│   │   ├── controllers/      # Business logic & request orchestration
│   │   ├── models/           # Data schemas & validation constraints
│   │   ├── routes/           # API endpoint definitions
│   │   ├── middlewares/      # Security & request interceptors
│   │   └── utils/            # Shared utilities (Mailer, Cron)
│   └── server.js             # Application bootstrap
│
└── frontend/                 # Client Application
    ├── src/
    │   ├── api/              # Axios network layer configuration
    │   ├── components/       # Reusable modular UI components
    │   ├── context/          # Global state management
    │   ├── pages/            # View controllers
    │   └── index.css         # Enterprise design system
    └── package.json          # Dependency manifest
```

---

## 📚 Documentation

For detailed information on the REST API endpoints, payloads, and response schemas, please refer to the [API.md](docs/API.md) documentation.

---

## 🤝 Contributing Guidelines

We welcome contributions from the engineering community. To ensure code quality and consistency:
1. **Fork the repository** and create a feature branch (`git checkout -b feature/EnterpriseFeature`).
2. **Commit your changes** utilizing conventional commit standards (`git commit -m 'feat: implement enterprise feature'`).
3. **Push to the branch** (`git push origin feature/EnterpriseFeature`).
4. **Open a Pull Request** for peer review.

Ensure all code passes existing linting and unit tests before submission.

---

## 📄 Legal & License

Copyright © 2026 PrismGrid Corporation.
This software is distributed under the [MIT License](LICENSE). See the LICENSE file for detailed terms and conditions.

---

## 📞 Support & Contact

For enterprise support, bug reports, or security vulnerability disclosures, please open an issue in the issue tracker or contact the engineering team via standard support channels.
