import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { connectDB, closeDB } from "./db/connection.js";
import { delayMiddleware } from "./middleware/delay.js";

// Import centralized router
import router from "./routes/router.js";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Register CORS
await fastify.register(cors, {
  origin: true, // Allow all origins in development
  credentials: true,
});

// Register delay middleware for slow endpoints
fastify.addHook("preHandler", delayMiddleware);

// Health check endpoint
fastify.get("/", async (request, reply) => {
  return {
    success: true,
    message: "Dynamic Table API Server",
    version: "1.0.0",
    endpoints: {
      schemas: "/api/v1/schema/:dataset",
      datasets: "/api/v1/datasets",
      netflix: {
        normal: "/api/v1/netflix",
        slow: "/api/v1/slow/netflix",
      },
      hrAnalytics: {
        normal: "/api/v1/hr-analytics",
        slow: "/api/v1/slow/hr-analytics",
      },
      sales: {
        normal: "/api/v1/sales",
        slow: "/api/v1/slow/sales",
      },
    },
  };
});

// Register all API routes under /api/v1 prefix
await fastify.register(router, { prefix: "/api/v1" });

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await closeDB();
  await fastify.close();
  process.exit(0);
});

// Start the server
const start = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start the server
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });

    console.log(`\nServer running at http://localhost:${port}`);
    console.log(`API Documentation: http://localhost:${port}/\n`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
