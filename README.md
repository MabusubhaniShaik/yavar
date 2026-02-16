# Dynamic Data Table Full-Stack Project

A premium, schema-driven dynamic data table application built with **Node.js (Fastify)**, **MongoDB**, and **React (Vite)**. This project supports multiple datasets, advanced filtering, basic bulk operations, and full state persistence in the URL.

---

## 🚀 Key Features

### Frontend (React + TypeScript)

- **Schema-Driven UI**: Tables automatically adapt based on the dataset selected (Netflix, Sales, HR Analytics).
- **Advanced Filtering**: Multi-column filtering with `AND/OR` logic, regex searching, and URL persistence.
- **Bulk Operations**: Multi-select rows to perform batch deletions.
- **Micro-Animations**: Smooth transitions and hover effects for a premium feel (Shadcn UI + Framer Motion/CSS).
- **Responsive Design**: Full mobile and desktop support with a glassmorphic aesthetic.
- **URL Deep Linking**: Share your exact view (including filters, page, and search queries) via the URL.

### Backend (Node.js + Fastify)

- **Generic REST Controller**: Highly reusable base controller for MongoDB collections.
- **Bulk Endpoints**: Optimized routes for batch operations.
- **Advanced Query Engine**: Dynamic MongoDB query builder for complex filters.
- **Slow Endpoint Simulator**: Middleware to simulate real-world API latency (5-10s) for testing loading states.
- **Graceful Shutdown**: Handles process termination cleanly.

---

## 🛠️ Technology Stack

| Component    | Technology                                                                                  |
| :----------- | :------------------------------------------------------------------------------------------ |
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Shadcn UI, Radix UI, Lucide Icons, Zustand, Axios |
| **Backend**  | Node.js, Fastify, MongoDB Driver, dotenv                                                    |
| **Testing**  | Vitest (Frontend), Jest (Backend)                                                           |
| **Database** | MongoDB (Local or Atlas)                                                                    |

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas connection string)

### 1. Installation

Install dependencies for both the backend and frontend.

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend
npm install
```

### 2. Environment Setup

**Backend:**

1.  Navigate to the `backend` directory.
2.  Create a `.env` file from the example.
    ```bash
    cp .env.example .env
    ```
3.  Open `.env` and update the `MONGODB_URI` if necessary (defaults to `mongodb://localhost:27017/dynamic-table`).

**Frontend:**
The frontend uses Vite's default environment handling. No manual `.env` setup is strictly required for local development unless you need to override the API URL.

### 3. Seeding Data

Populate your database with the initial datasets (Netflix, HR Analytics, Sales).

```bash
cd backend
npm run seed
```

_Note: This utilizes CSV files located in `backend/data/`._

### 4. Running the Project

Start both servers in separate terminal windows.

**Backend Server:**

```bash
cd backend
npm run dev
# Server runs at http://localhost:3000
```

**Frontend Application:**

```bash
cd frontend
npm run dev
# App runs at http://localhost:5173
```

---

## 🧪 Testing

### Backend Tests (Jest)

Runs unit and integration tests for the API.

```bash
cd backend
npm test
```

### Frontend Tests (Vitest)

Runs component and logic tests.

```bash
cd frontend
npm test
```

---

## 📚 API Documentation

The backend provides a RESTful API with the following key endpoints:

- **Base URL**: `http://localhost:3000/api/v1`
- **Datasets**: `GET /datasets`
- **Schema**: `GET /schema/:dataset` (e.g., `netflix`, `hr-analytics`, `sales`)
- **Data (Normal)**: `GET /:dataset`
- **Data (Simulated Delay)**: `GET /slow/:dataset` (Adds 5-10s latency)

For more detailed API documentation, please refer to the [Backend README](./backend/README.md).

---

**Developed for Yavar Full-Stack Challenge.**
