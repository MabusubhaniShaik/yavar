import { getSchema, getAvailableDatasets } from "../db/schemas.js";

export default async function schemaRoutes(fastify, options) {
  // Get all available datasets
  fastify.get("/datasets", async (request, reply) => {
    return {
      success: true,
      datasets: getAvailableDatasets(),
    };
  });

  // Get schema for Netflix dataset
  fastify.get("/schema/netflix", async (request, reply) => {
    return {
      success: true,
      schema: getSchema("netflix"),
    };
  });

  // Get schema for HR Analytics dataset
  fastify.get("/schema/hr-analytics", async (request, reply) => {
    return {
      success: true,
      schema: getSchema("hr_analytics"),
    };
  });

  // Get schema for Sales dataset
  fastify.get("/schema/sales", async (request, reply) => {
    return {
      success: true,
      schema: getSchema("sales"),
    };
  });
}
