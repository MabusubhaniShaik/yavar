# Dynamic Data Table Full-Stack Project

A premium, schema-driven dynamic data table application built with **Node.js (Fastify)**, **MongoDB**, and **React (Vite)**. This project supports multiple datasets, advanced filtering, bulk operations, and full state persistence in the URL.

---

## Key Features

### Frontend (React + TypeScript)
- **Schema-Driven UI**: Tables automatically adapt based on the dataset selected (Netflix, Sales, HR Analytics).
- **Advanced Filtering**: Multi-column filtering with `AND/OR` logic, regex searching, and URL persistence.
- **Bulk Operations**: Multi-select rows to perform batch edits or batch deletes.
- **Micro-Animations**: Smooth transitions and hover effects for a premium feel.
- **Responsive Design**: Full mobile and desktop support with a glassmorphic aesthetic.
- **URL Deep Linking**: Share your exact view (including filters and page) with anyone via the URL.

### Backend (Node.js + Fastify)
- **Generic REST Controller**: Highly reusable base controller for any MongoDB collection.
- **Bulk Endpoints**: Optimized routes for batch updates and deletions.
- **Advanced Query Engine**: Dynamic MongoDB query builder for complex filters.
- **Slow Endpoint Simulator**: Middleware to simulate real-world API latency (5-10s).
- **Graceful Shutdown**: Handles process termination cleanly.

---

## Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide Icons, Zustand |
| **Backend** | Fastify, Node.js, MongoDB Driver |
| **Testing** | Vitest (Frontend), Jest (Backend) |
| **Database** | MongoDB Atlas (Cloud) |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)

### 1. Installation

Install dependencies for both the backend and frontend:

```bash
# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

Create a `.env` file in the `backend/` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

---

## Running the Project

### Development Mode
Start both the backend and frontend simultaneously.

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Seeding Data
To populate your database with initial datasets:
```bash
cd backend
npm run seed
```

---

## E2E & Component Testing (Jest)

The project uses **Jest** and **React Testing Library** for both component and end-to-end simulation tests.

### E2E Simulation Logic
Instead of using heavy browser automation, we use a "Virtual E2E" approach inside the JSDOM environment. This allows for lightning-fast verification of full user flows without the overhead of Playwright or Cypress.

### Test Structure
```bash
frontend/src/tests-e2e/
└── app.flow.test.tsx    # Full user flow (Seed -> Select -> Filter -> Bulk Delete)
```

### How to Run Tests
**Frontend Tests:**
```bash
cd frontend
npm test
```

**Backend Tests:**
```bash
cd backend
npm test
```


---

**Developed for Yavar Full-Stack Challenge.**
