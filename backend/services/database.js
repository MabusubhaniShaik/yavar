import { ObjectId } from "mongodb";
import { getDB, COLLECTIONS } from "../db/connection.js";
import { getSchema } from "../db/schemas.js";

// Helper to safely convert string to ObjectId
const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (e) {
    return id;
  }
};

// Get all records from a collection with pagination and advanced filtering
export async function getAllRecords(
  collectionName,
  { page = 1, limit = 10, search = "", filters = null } = {}
) {
  const db = getDB();
  const collection = db.collection(collectionName);

  const skip = (page - 1) * limit;

  // Build query
  let query = {};

  // Simple Search
  if (search) {
    // Search across all text fields (this requires a text index on the collection)
    query.$or = [{ $text: { $search: search } }];
  }

  // Advanced Filtering
  if (filters) {
    // filters expect an object like: { logic: 'AND', conditions: [{ field: 'name', operator: 'contains', value: 'john' }] }
    const { logic = "AND", conditions = [] } = filters;

    if (conditions.length > 0) {
      const mongoConditions = conditions.map((c) => {
        const { field, operator, value } = c;
        switch (operator) {
          case "equals":
            return { [field]: value };
          case "contains":
            return { [field]: { $regex: value, $options: "i" } };
          case "starts_with":
            return { [field]: { $regex: `^${value}`, $options: "i" } };
          case "ends_with":
            return { [field]: { $regex: `${value}$`, $options: "i" } };
          case "gt":
            return { [field]: { $gt: isNaN(value) ? value : Number(value) } };
          case "lt":
            return { [field]: { $lt: isNaN(value) ? value : Number(value) } };
          case "gte":
            return { [field]: { $gte: isNaN(value) ? value : Number(value) } };
          case "lte":
            return { [field]: { $lte: isNaN(value) ? value : Number(value) } };
          case "not_equals":
            return { [field]: { $ne: value } };
          default:
            return { [field]: value };
        }
      });

      if (logic === "OR") {
        query.$or = query.$or
          ? [...query.$or, ...mongoConditions]
          : mongoConditions;
      } else {
        // AND is default
        query.$and = mongoConditions;
      }
    }
  }

  const [data, total] = await Promise.all([
    collection.find(query).skip(skip).limit(limit).toArray(),
    collection.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Get a single record by ID
export async function getRecordById(collectionName, id) {
  const db = getDB();
  const collection = db.collection(collectionName);
  const objectId = toObjectId(id);

  // Try to find by _id (ObjectId or string) or by a custom id field
  const record = await collection.findOne({
    $or: [{ _id: objectId }, { _id: id }, { id: id }],
  });

  return record;
}

// Create a new record
export async function createRecord(collectionName, data) {
  const db = getDB();
  const collection = db.collection(collectionName);

  const result = await collection.insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    _id: result.insertedId,
    ...data,
  };
}

// Update a record
export async function updateRecord(collectionName, id, data) {
  const db = getDB();
  const collection = db.collection(collectionName);
  const objectId = toObjectId(id);

  // Remove _id from data to prevent immutable field error
  const { _id, ...updateData } = data;

  const result = await collection.findOneAndUpdate(
    { $or: [{ _id: objectId }, { _id: id }, { id: id }] },
    {
      $set: {
        ...updateData,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  return result;
}

// Bulk Update records
export async function bulkUpdateRecords(collectionName, ids, data) {
  const db = getDB();
  const collection = db.collection(collectionName);

  const objectIds = ids.map((id) => toObjectId(id));
  const { _id, ...updateData } = data;

  const result = await collection.updateMany(
    {
      $or: [
        { _id: { $in: objectIds } },
        { _id: { $in: ids } },
        { id: { $in: ids } },
      ],
    },
    {
      $set: {
        ...updateData,
        updatedAt: new Date(),
      },
    }
  );

  return result.modifiedCount;
}

// Delete a record
export async function deleteRecord(collectionName, id) {
  const db = getDB();
  const collection = db.collection(collectionName);
  const objectId = toObjectId(id);

  const result = await collection.deleteOne({
    $or: [{ _id: objectId }, { _id: id }, { id: id }],
  });

  return result.deletedCount > 0;
}

// Bulk Delete records
export async function bulkDeleteRecords(collectionName, ids) {
  const db = getDB();
  const collection = db.collection(collectionName);

  const objectIds = ids.map((id) => toObjectId(id));

  const result = await collection.deleteMany({
    $or: [
      { _id: { $in: objectIds } },
      { _id: { $in: ids } },
      { id: { $in: ids } },
    ],
  });

  return result.deletedCount;
}

// Get collection stats
export async function getCollectionStats(collectionName) {
  const db = getDB();
  const collection = db.collection(collectionName);

  const count = await collection.countDocuments();

  return {
    collectionName,
    totalRecords: count,
  };
}
