import { jest } from "@jest/globals";
import { ObjectId } from "mongodb";

const mockCollection = {
  find: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  toArray: jest.fn(),
  countDocuments: jest.fn(),
  findOne: jest.fn(),
  insertOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
  updateMany: jest.fn(),
  deleteOne: jest.fn(),
  deleteMany: jest.fn(),
};

const mockDB = {
  collection: jest.fn().mockReturnValue(mockCollection),
};

jest.unstable_mockModule("../../db/connection.js", () => ({
  getDB: jest.fn().mockReturnValue(mockDB),
  COLLECTIONS: {
    NETFLIX: "netflix",
  },
}));

const {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  bulkUpdateRecords,
  bulkDeleteRecords,
  getCollectionStats,
} = await import("../database.js");

describe("Database Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllRecords", () => {
    it("should fetch records with pagination and default values", async () => {
      const mockData = [{ _id: new ObjectId(), title: "Test" }];
      mockCollection.toArray.mockResolvedValue(mockData);
      mockCollection.countDocuments.mockResolvedValue(1);

      const result = await getAllRecords("test-collection");

      expect(mockDB.collection).toHaveBeenCalledWith("test-collection");
      expect(mockCollection.find).toHaveBeenCalledWith({});
      expect(mockCollection.skip).toHaveBeenCalledWith(0);
      expect(mockCollection.limit).toHaveBeenCalledWith(10);
      expect(result.data).toEqual(mockData);
      expect(result.pagination.total).toBe(1);
    });

    it("should apply search query if provided", async () => {
      mockCollection.toArray.mockResolvedValue([]);
      mockCollection.countDocuments.mockResolvedValue(0);

      await getAllRecords("test-collection", { search: "query" });

      expect(mockCollection.find).toHaveBeenCalledWith({
        $or: [{ $text: { $search: "query" } }],
      });
    });

    it("should apply advanced filters if provided", async () => {
      mockCollection.toArray.mockResolvedValue([]);
      mockCollection.countDocuments.mockResolvedValue(0);

      const filters = {
        logic: "AND",
        conditions: [{ field: "type", operator: "equals", value: "Movie" }],
      };

      await getAllRecords("test-collection", { filters });

      expect(mockCollection.find).toHaveBeenCalledWith({
        $and: [{ type: "Movie" }],
      });
    });
  });

  describe("getRecordById", () => {
    it("should find record by ObjectId if ID is valid", async () => {
      const validId = new ObjectId().toString();
      mockCollection.findOne.mockResolvedValue({ _id: validId });

      const result = await getRecordById("test", validId);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        $or: [{ _id: expect.any(ObjectId) }, { _id: validId }, { id: validId }],
      });
      expect(result._id).toBe(validId);
    });

    it("should fallback to string if ID is invalid ObjectId", async () => {
      const invalidId = "not-an-object-id";
      mockCollection.findOne.mockResolvedValue(null);

      await getRecordById("test", invalidId);

      expect(mockCollection.findOne).toHaveBeenCalledWith({
        $or: [{ _id: invalidId }, { _id: invalidId }, { id: invalidId }],
      });
    });
  });

  describe("createRecord", () => {
    it("should insert record with timestamps", async () => {
      const data = { name: "New" };
      const insertedId = new ObjectId();
      mockCollection.insertOne.mockResolvedValue({ insertedId });

      const result = await createRecord("test", data);

      expect(mockCollection.insertOne).toHaveBeenCalledWith(
        expect.objectContaining({
          ...data,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        })
      );
      expect(result._id).toBe(insertedId);
    });
  });

  describe("updateRecord", () => {
    it("should update record and set updatedAt", async () => {
      const id = new ObjectId().toString();
      const updateData = { name: "Updated" };
      mockCollection.findOneAndUpdate.mockResolvedValue({
        _id: id,
        ...updateData,
      });

      const result = await updateRecord("test", id, updateData);

      expect(mockCollection.findOneAndUpdate).toHaveBeenCalledWith(
        expect.any(Object),
        {
          $set: expect.objectContaining({
            name: "Updated",
            updatedAt: expect.any(Date),
          }),
        },
        { returnDocument: "after" }
      );
      expect(result.name).toBe("Updated");
    });
  });

  describe("deleteRecord", () => {
    it("should return true if record was deleted", async () => {
      const id = new ObjectId().toString();
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await deleteRecord("test", id);

      expect(result).toBe(true);
    });

    it("should return false if no record was deleted", async () => {
      mockCollection.deleteOne.mockResolvedValue({ deletedCount: 0 });
      const result = await deleteRecord("test", "id");
      expect(result).toBe(false);
    });
  });

  describe("bulkUpdateRecords", () => {
    it("should update multiple records and return count", async () => {
      const ids = ["1", "2"];
      const updateData = { status: "bulk" };
      mockCollection.updateMany.mockResolvedValue({ modifiedCount: 2 });

      const result = await bulkUpdateRecords("test", ids, updateData);

      expect(mockCollection.updateMany).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ $set: expect.any(Object) })
      );
      expect(result).toBe(2);
    });
  });

  describe("bulkDeleteRecords", () => {
    it("should delete multiple records and return count", async () => {
      const ids = ["1", "2"];
      mockCollection.deleteMany.mockResolvedValue({ deletedCount: 2 });

      const result = await bulkDeleteRecords("test", ids);

      expect(mockCollection.deleteMany).toHaveBeenCalledWith(
        expect.any(Object)
      );
      expect(result).toBe(2);
    });
  });

  describe("getCollectionStats", () => {
    it("should return collection name and total count", async () => {
      mockCollection.countDocuments.mockResolvedValue(42);
      const result = await getCollectionStats("test");
      expect(result).toEqual({
        collectionName: "test",
        totalRecords: 42,
      });
    });
  });
});
