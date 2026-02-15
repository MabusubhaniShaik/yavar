import { NetflixController } from "../controllers/NetflixController.js";
import { HrAnalyticsController } from "../controllers/HrAnalyticsController.js";
import { SalesController } from "../controllers/SalesController.js";
import schemaRoutes from "./schema.js";

// Initialize controllers
const netflixController = new NetflixController();
const hrController = new HrAnalyticsController();
const salesController = new SalesController();

/**
 * Helper to register CRUD routes for a controller
 */
function registerCrudRoutes(fastify, prefix, controller) {
  fastify.get(prefix, controller.getAll);
  fastify.get(`${prefix}/:id`, controller.getById);
  fastify.post(prefix, controller.create);
  fastify.put(prefix, controller.bulkUpdate); // Bulk update
  fastify.put(`${prefix}/:id`, controller.updateById);
  fastify.delete(prefix, controller.bulkDelete); // Bulk delete
  fastify.delete(`${prefix}/:id`, controller.deleteById);
}

/**
 * Main Router
 */
export default async function router(fastify, options) {
  // --- Schema Routes ---
  // (Keeping existing schema routes as they have specific logic)
  fastify.register(schemaRoutes);

  // --- Netflix Routes ---
  registerCrudRoutes(fastify, "/netflix", netflixController);

  // Slow endpoint for Netflix (Simulated delay handled by middleware/hooks if configured,
  // or explicitly if we want specific slow routes.
  // The original server.js had specific /slow endpoints.
  // We can map them to the same controller methods but maybe with a delay hook?
  // For now, let's just map them as requested in original setup).
  registerCrudRoutes(fastify, "/slow/netflix", netflixController);

  // --- HR Analytics Routes ---
  registerCrudRoutes(fastify, "/hr-analytics", hrController);
  registerCrudRoutes(fastify, "/slow/hr-analytics", hrController);

  // --- Sales Routes ---
  registerCrudRoutes(fastify, "/sales", salesController);
  registerCrudRoutes(fastify, "/slow/sales", salesController);
}
