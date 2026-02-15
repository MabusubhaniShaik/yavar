import { jest } from "@jest/globals";

// Relative to controllers/__tests__/controllers.test.js: ../../db/connection.js
jest.unstable_mockModule("../../db/connection.js", () => ({
  getDB: jest.fn(),
  COLLECTIONS: {
    NETFLIX: "netflix",
    HR_ANALYTICS: "hr-analytics",
    SALES: "sales",
  },
}));

const { NetflixController } = await import("../NetflixController.js");
const { HrAnalyticsController } = await import("../HrAnalyticsController.js");
const { SalesController } = await import("../SalesController.js");

describe("Specific Controllers", () => {
  it("NetflixController should use netflix collection", () => {
    const controller = new NetflixController();
    expect(controller.collectionName).toBe("netflix");
  });

  it("HrAnalyticsController should use hr-analytics collection", () => {
    const controller = new HrAnalyticsController();
    expect(controller.collectionName).toBe("hr-analytics");
  });

  it("SalesController should use sales collection", () => {
    const controller = new SalesController();
    expect(controller.collectionName).toBe("sales");
  });
});
