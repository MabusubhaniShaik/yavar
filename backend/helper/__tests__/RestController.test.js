import { jest } from "@jest/globals";

jest.unstable_mockModule("../../services/database.js", () => ({
  getAllRecords: jest.fn(),
  getRecordById: jest.fn(),
  createRecord: jest.fn(),
  updateRecord: jest.fn(),
  deleteRecord: jest.fn(),
  bulkUpdateRecords: jest.fn(),
  bulkDeleteRecords: jest.fn(),
}));

const dbService = await import("../../services/database.js");
const { RestController } = await import("../RestController.js");

describe("RestController", () => {
  let controller;
  let mockRequest;
  let mockReply;

  beforeEach(() => {
    controller = new RestController("test-collection");
    mockRequest = {
      query: {},
      params: {},
      body: {},
      log: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
      },
    };
    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return records on success", async () => {
      const mockResult = { data: [], pagination: {} };
      dbService.getAllRecords.mockResolvedValue(mockResult);

      const result = await controller.getAll(mockRequest, mockReply);

      expect(dbService.getAllRecords).toHaveBeenCalledWith(
        "test-collection",
        expect.any(Object)
      );
      expect(result).toEqual({ success: true, ...mockResult });
    });

    it("should handle errors", async () => {
      dbService.getAllRecords.mockRejectedValue(new Error("DB Error"));

      await controller.getAll(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });
  });

  describe("getById", () => {
    it("should return record if found", async () => {
      const mockRecord = { _id: "1" };
      mockRequest.params.id = "1";
      dbService.getRecordById.mockResolvedValue(mockRecord);

      const result = await controller.getById(mockRequest, mockReply);

      expect(result).toEqual({ success: true, data: mockRecord });
    });

    it("should return 404 if record not found", async () => {
      mockRequest.params.id = "1";
      dbService.getRecordById.mockResolvedValue(null);

      await controller.getById(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(404);
    });

    it("should handle errors", async () => {
      dbService.getRecordById.mockRejectedValue(new Error("Error"));
      await controller.getById(mockRequest, mockReply);
      expect(mockReply.code).toHaveBeenCalledWith(500);
    });
  });

  describe("create", () => {
    it("should create record and run hooks", async () => {
      const mockData = { name: "New" };
      const mockCreated = { _id: "1", ...mockData };
      mockRequest.body = mockData;
      dbService.createRecord.mockResolvedValue(mockCreated);

      // Spy on hooks
      const preSaveSpy = jest.spyOn(controller, "preSave");
      const postSaveSpy = jest.spyOn(controller, "postSave");

      await controller.create(mockRequest, mockReply);

      expect(preSaveSpy).toHaveBeenCalledWith(mockData);
      expect(dbService.createRecord).toHaveBeenCalledWith(
        "test-collection",
        mockData
      );
      expect(postSaveSpy).toHaveBeenCalled();
      expect(mockReply.code).toHaveBeenCalledWith(201);
    });

    it("should handle errors in create", async () => {
      dbService.createRecord.mockRejectedValue(new Error("Error"));
      await controller.create(mockRequest, mockReply);
      expect(mockReply.code).toHaveBeenCalledWith(500);
    });
  });

  describe("updateById", () => {
    it("should update record and run hooks", async () => {
      const id = "1";
      const mockData = { name: "Updated" };
      mockRequest.params.id = id;
      mockRequest.body = mockData;
      dbService.updateRecord.mockResolvedValue(mockData);

      const preUpdateSpy = jest.spyOn(controller, "preUpdate");
      const postUpdateSpy = jest.spyOn(controller, "postUpdate");

      const result = await controller.updateById(mockRequest, mockReply);

      expect(preUpdateSpy).toHaveBeenCalledWith(id, mockData);
      expect(dbService.updateRecord).toHaveBeenCalledWith(
        "test-collection",
        id,
        mockData
      );
      expect(postUpdateSpy).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });

    it("should return 404 if record not found for update", async () => {
      dbService.updateRecord.mockResolvedValue(null);
      await controller.updateById(mockRequest, mockReply);
      expect(mockReply.code).toHaveBeenCalledWith(404);
    });

    it("should handle errors in update", async () => {
      dbService.updateRecord.mockRejectedValue(new Error("Error"));
      await controller.updateById(mockRequest, mockReply);
      expect(mockReply.code).toHaveBeenCalledWith(500);
    });
  });

  describe("bulkUpdate", () => {
    it("should update multiple records", async () => {
      mockRequest.body = { ids: ["1", "2"], data: { status: "updated" } };
      dbService.bulkUpdateRecords.mockResolvedValue(2);

      const result = await controller.bulkUpdate(mockRequest, mockReply);

      expect(dbService.bulkUpdateRecords).toHaveBeenCalledWith(
        "test-collection",
        ["1", "2"],
        { status: "updated" }
      );
      expect(result.success).toBe(true);
      expect(result.modifiedCount).toBe(2);
    });

    it("should return 400 for invalid body", async () => {
      mockRequest.body = { ids: [] };
      await controller.bulkUpdate(mockRequest, mockReply);
      expect(mockReply.code).toHaveBeenCalledWith(400);
    });
  });

  describe("bulkDelete", () => {
    it("should delete multiple records", async () => {
      mockRequest.body = { ids: ["1", "2"] };
      dbService.bulkDeleteRecords.mockResolvedValue(2);

      const result = await controller.bulkDelete(mockRequest, mockReply);

      expect(dbService.bulkDeleteRecords).toHaveBeenCalledWith(
        "test-collection",
        ["1", "2"]
      );
      expect(result.success).toBe(true);
      expect(result.deletedCount).toBe(2);
    });

    it("should return 400 for invalid body", async () => {
      mockRequest.body = { ids: null };
      await controller.bulkDelete(mockRequest, mockReply);
      expect(mockReply.code).toHaveBeenCalledWith(400);
    });
  });
});
