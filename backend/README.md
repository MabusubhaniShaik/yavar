# Backend API - Dynamic Data Table

Backend API server for the Dynamic Data Table application with support for multiple datasets and network performance simulation.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or remote instance)
- npm or yarn

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your MongoDB connection string:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/dynamic-table
   NODE_ENV=development
   ```

3. **Download Kaggle datasets:**

   Download the following datasets and place CSV files in the `data/` folder:
   - **Netflix Shows**: https://www.kaggle.com/datasets/shivamb/netflix-shows
     - Save as: `data/netflix_titles.csv`
   - **IBM HR Analytics**: https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset
     - Save as: `data/WA_Fn-UseC_-HR-Employee-Attrition.csv`
   - **Sample Sales Data**: https://www.kaggle.com/datasets/kyanyoga/sample-sales-data
     - Save as: `data/sales_data_sample.csv`

4. **Seed the database:**

   ```bash
   npm run seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3000`

---

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api/v1
```

### Endpoints

#### 1. Schema Endpoints

Get table schema definitions for dynamic table generation.

```http
GET /api/v1/datasets
```

Returns list of available datasets.

```http
GET /api/v1/schema/netflix
GET /api/v1/schema/hr-analytics
GET /api/v1/schema/sales
```

Returns schema definition including columns, data types, and display properties.

#### 2. Data Endpoints

Each dataset has **two variants**:

- **Normal**: Standard response time
- **Slow**: Random 5-10 second delay

##### Netflix Dataset

```http
# Normal
GET    /api/v1/netflix?page=1&limit=100&search=query
GET    /api/v1/netflix/:id
POST   /api/v1/netflix
PUT    /api/v1/netflix/:id
DELETE /api/v1/netflix/:id

# Slow (5-10s delay)
GET    /api/v1/slow/netflix?page=1&limit=100&search=query
```

##### HR Analytics Dataset

```http
# Normal
GET    /api/v1/hr-analytics?page=1&limit=100&search=query
GET    /api/v1/hr-analytics/:id
POST   /api/v1/hr-analytics
PUT    /api/v1/hr-analytics/:id
DELETE /api/v1/hr-analytics/:id

# Slow (5-10s delay)
GET    /api/v1/slow/hr-analytics?page=1&limit=100&search=query
```

##### Sales Dataset

```http
# Normal
GET    /api/v1/sales?page=1&limit=100&search=query
GET    /api/v1/sales/:id
POST   /api/v1/sales
PUT    /api/v1/sales/:id
DELETE /api/v1/sales/:id

# Slow (5-10s delay)
GET    /api/v1/slow/sales?page=1&limit=100&search=query
```

### Query Parameters

- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Records per page (default: 100)
- `search` (optional): Search term for filtering

### Response Format

All endpoints return JSON in this format:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 500,
    "totalPages": 5
  }
}
```

---

## 🏗️ Project Structure

```
backend/
├── db/
│   ├── connection.js      # MongoDB connection management
│   └── schemas.js         # Schema definitions for all datasets
├── middleware/
│   └── delay.js           # Random delay middleware for slow endpoints
├── routes/
│   ├── schema.js          # Schema definition endpoints
│   ├── netflix.js         # Netflix dataset endpoints
│   ├── hrAnalytics.js     # HR Analytics dataset endpoints
│   └── sales.js           # Sales dataset endpoints
├── services/
│   └── database.js        # Database service layer (CRUD operations)
├── scripts/
│   └── seed.js            # Database seeding script
├── data/                  # CSV files (not in git)
│   ├── netflix_titles.csv
│   ├── WA_Fn-UseC_-HR-Employee-Attrition.csv
│   └── sales_data_sample.csv
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
├── server.js              # Main server file
└── README.md
```

---

## 🔧 Tech Stack

- **Runtime**: Node.js
- **Framework**: Fastify
- **Database**: MongoDB
- **CSV Parsing**: csv-parse
- **CORS**: @fastify/cors
- **Environment**: dotenv

---

## 🌟 Features

✅ **Dynamic Schema System**: API-driven table structure  
✅ **Multiple Datasets**: 3 different Kaggle datasets  
✅ **Network Simulation**: Normal and slow endpoint variants  
✅ **Full CRUD**: Create, Read, Update, Delete operations  
✅ **Pagination**: Efficient data loading  
✅ **Search**: Basic text search functionality  
✅ **CORS Enabled**: Ready for frontend integration  
✅ **Graceful Shutdown**: Proper cleanup on exit

---

## 🧪 Testing

Test the API using curl or any HTTP client:

```bash
# Get Netflix schema
curl http://localhost:3000/api/v1/schema/netflix

# Get Netflix data (normal)
curl http://localhost:3000/api/v1/netflix?page=1&limit=10

# Get Netflix data (slow - will take 5-10 seconds)
curl http://localhost:3000/api/v1/slow/netflix?page=1&limit=10

# Create new record
curl -X POST http://localhost:3000/api/v1/netflix \
  -H "Content-Type: application/json" \
  -d '{"title":"New Show","type":"Movie"}'
```

---

## 📝 Notes

- The delay middleware adds a random 5-10 second delay to any endpoint containing `/slow/` in the URL
- All slow endpoints return identical data to their normal counterparts
- MongoDB must be running before starting the server
- Seed script will clear existing data before importing

---

## 🐛 Troubleshooting

**MongoDB connection failed:**

- Ensure MongoDB is running: `mongod` or check your MongoDB service
- Verify `MONGODB_URI` in `.env` is correct

**Seed script fails:**

- Check that CSV files are in the `data/` folder
- Verify file names match exactly as specified
- Ensure MongoDB is running

**Port already in use:**

- Change `PORT` in `.env` file
- Or kill the process using port 3000

---

## 📄 License

MIT
