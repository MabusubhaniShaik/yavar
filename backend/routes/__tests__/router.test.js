import { jest } from "@jest/globals";

// Relative to routes/__tests__/router.test.js: ../../controllers/*.js
jest.unstable_mockModule("../../controllers/NetflixController.js", () => ({
  NetflixController: jest.fn().mockImplementation(() => ({
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  })),
}));

jest.unstable_mockModule("../../controllers/HrAnalyticsController.js", () => ({
  HrAnalyticsController: jest.fn().mockImplementation(() => ({
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  })),
}));

jest.unstable_mockModule("../../controllers/SalesController.js", () => ({
  SalesController: jest.fn().mockImplementation(() => ({
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  })),
}));

// Relative to routes/__tests__/router.test.js: ../schema.js
jest.unstable_mockModule("../schema.js", () => ({
  default: jest.fn().mockImplementation((f) => f.get("/schema", () => {})),
}));

// Relative to routes/__tests__/router.test.js: ../router.js
const router = (await import("../router.js")).default;

describe("Router", () => {
  let mockFastify;

  beforeEach(() => {
    mockFastify = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      register: jest.fn(),
    };
  });

  it("should register all routes for all datasets", async () => {
    await router(mockFastify);

    // Schema routes registered
    expect(mockFastify.register).toHaveBeenCalled();

    // Verification for one dataset (Netflix)
    expect(mockFastify.get).toHaveBeenCalledWith(
      "/netflix",
      expect.any(Function)
    );
    expect(mockFastify.get).toHaveBeenCalledWith(
      "/slow/netflix",
      expect.any(Function)
    );
    expect(mockFastify.post).toHaveBeenCalledWith(
      "/netflix",
      expect.any(Function)
    );

    expect(mockFastify.get).toHaveBeenCalledWith(
      "/hr-analytics",
      expect.any(Function)
    );
    expect(mockFastify.get).toHaveBeenCalledWith(
      "/sales",
      expect.any(Function)
    );
  });
});
