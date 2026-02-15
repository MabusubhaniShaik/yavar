import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import { connectDB, getDB, COLLECTIONS, closeDB } from "../db/connection.js";

// Seed script to import Kaggle datasets into MongoDB
// Instructions:
// 1. Download the 3 Kaggle datasets from the URLs in data/README.md
// 2. Place the CSV files in the 'data' folder with exact names specified
// 3. Run: npm run seed

const DATA_DIR = path.join(process.cwd(), "data");

// Helper function to read and parse CSV file
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    fs.createReadStream(filePath)
      .pipe(parser)
      .on("data", (record) => {
        records.push(record);
      })
      .on("end", () => {
        resolve(records);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Seed Netflix dataset
async function seedNetflix() {
  const filePath = path.join(DATA_DIR, "netflix_titles.csv");

  if (!fs.existsSync(filePath)) {
    console.log("Warning: Netflix dataset not found. Skipping...");
    console.log(`Expected: ${filePath}`);
    return;
  }

  console.log("Seeding Netflix dataset...");
  const data = await readCSV(filePath);

  const db = getDB();
  const collection = db.collection(COLLECTIONS.NETFLIX);

  await collection.deleteMany({});

  if (data.length > 0) {
    await collection.insertMany(data);
    console.log(`Inserted ${data.length} Netflix records`);
  }
}

// Seed HR Analytics dataset
async function seedHRAnalytics() {
  const filePath = path.join(DATA_DIR, "WA_Fn-UseC_-HR-Employee-Attrition.csv");

  if (!fs.existsSync(filePath)) {
    console.log("Warning: HR Analytics dataset not found. Skipping...");
    console.log(`Expected: ${filePath}`);
    return;
  }

  console.log("Seeding HR Analytics dataset...");
  const data = await readCSV(filePath);

  const db = getDB();
  const collection = db.collection(COLLECTIONS.HR_ANALYTICS);

  await collection.deleteMany({});

  // Convert numeric fields
  const processedData = data.map((record) => {
    return {
      ...record,
      Age: parseInt(record.Age) || 0,
      DistanceFromHome: parseInt(record.DistanceFromHome) || 0,
      Education: parseInt(record.Education) || 0,
      EmployeeNumber: parseInt(record.EmployeeNumber) || 0,
      JobSatisfaction: parseInt(record.JobSatisfaction) || 0,
      MonthlyIncome: parseInt(record.MonthlyIncome) || 0,
      PerformanceRating: parseInt(record.PerformanceRating) || 0,
      YearsAtCompany: parseInt(record.YearsAtCompany) || 0,
    };
  });

  if (processedData.length > 0) {
    await collection.insertMany(processedData);
    console.log(`Inserted ${processedData.length} HR Analytics records`);
  }
}

// Seed Sales dataset
async function seedSales() {
  const filePath = path.join(DATA_DIR, "sales_data_sample.csv");

  if (!fs.existsSync(filePath)) {
    console.log("Warning: Sales dataset not found. Skipping...");
    console.log(`Expected: ${filePath}`);
    return;
  }

  console.log("Seeding Sales dataset...");
  const data = await readCSV(filePath);

  const db = getDB();
  const collection = db.collection(COLLECTIONS.SALES);

  await collection.deleteMany({});

  // Convert numeric fields
  const processedData = data.map((record) => {
    return {
      ...record,
      ORDERNUMBER: parseInt(record.ORDERNUMBER) || 0,
      QUANTITYORDERED: parseInt(record.QUANTITYORDERED) || 0,
      PRICEEACH: parseFloat(record.PRICEEACH) || 0,
      ORDERLINENUMBER: parseInt(record.ORDERLINENUMBER) || 0,
      SALES: parseFloat(record.SALES) || 0,
    };
  });

  if (processedData.length > 0) {
    await collection.insertMany(processedData);
    console.log(`Inserted ${processedData.length} Sales records`);
  }
}

// Main seed function
async function seed() {
  try {
    console.log("\nStarting database seeding...\n");

    // Check if data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      console.log("Error: Data directory not found!");
      console.log(`Please create: ${DATA_DIR}`);
      console.log(
        "And download the Kaggle datasets (see instructions in data/README.md)"
      );
      process.exit(1);
    }

    await connectDB();

    await seedNetflix();
    await seedHRAnalytics();
    await seedSales();

    console.log("\nDatabase seeding completed!\n");

    await closeDB();
    process.exit(0);
  } catch (error) {
    console.error("\nSeeding failed:", error);
    process.exit(1);
  }
}

seed();
