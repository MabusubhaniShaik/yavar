import { jest } from "@jest/globals";

// Mock mongodb
const mockClient = {
  connect: jest.fn(),
  db: jest.fn().mockReturnValue({}),
  close: jest.fn().mockResolvedValue({}),
};

jest.unstable_mockModule("mongodb", () => ({
  MongoClient: jest.fn().mockImplementation(() => mockClient),
}));

// Mock dotenv to prevent it from loading real .env during tests
jest.unstable_mockModule("dotenv", () => ({
  default: {
    config: jest.fn(),
  },
}));

// Mock process.exit and console.error
const mockExit = jest.spyOn(process, "exit").mockImplementation((code) => {
  throw new Error(`Process exited with code ${code}`);
});
const mockConsoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => {});

describe("DB Connection", () => {
  let connectionModule;

  beforeAll(async () => {
    // Ensure we have a clean environment for the first import
    delete process.env.MONGODB_URI;
    connectionModule = await import("../connection.js");
  });

  afterAll(() => {
    mockExit.mockRestore();
    mockConsoleError.mockRestore();
  });

  it("should throw error if getDB called before connectDB", () => {
    expect(() => connectionModule.getDB()).toThrow(
      "Database not initialized. Call connectDB() first."
    );
  });

  it("should connect to database successfully", async () => {
    mockClient.connect.mockResolvedValue({});
    const db = await connectionModule.connectDB();
    expect(db).toBeDefined();
    expect(connectionModule.getDB()).toBe(db);
  });

  it("should handle connection errors", async () => {
    const error = new Error("Connection failed");
    mockClient.connect.mockRejectedValue(error);
    await expect(connectionModule.connectDB()).rejects.toThrow(
      "Process exited with code 1"
    );
    expect(mockConsoleError).toHaveBeenCalledWith(
      "MongoDB connection error:",
      error
    );
  });

  it("should close database connection", async () => {
    await connectionModule.closeDB();
    expect(mockClient.close).toHaveBeenCalled();
  });
});
