import * as dbService from "../services/database.js";

// Base Controller class for CRUD operations
export class RestController {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  // Pre-save hook (can be overridden)
  async preSave(data) {
    return data;
  }

  // Post-save hook (can be overridden)
  async postSave(data, result) {
    // Default: do nothing
  }

  // Pre-update hook (can be overridden)
  async preUpdate(id, data) {
    return data;
  }

  // Post-update hook (can be overridden)
  async postUpdate(id, result) {
    // Default: do nothing
  }

  // Get all records with pagination and search */
  getAll = async (request, reply) => {
    try {
      const { page, limit, search, filters } = request.query;

      let parsedFilters = null;
      if (filters) {
        try {
          parsedFilters = JSON.parse(filters);
        } catch (e) {
          request.log.warn("Failed to parse filters", filters);
        }
      }

      request.log.info({
        msg: `Fetching records from ${this.collectionName}`,
        page,
        limit,
        search,
        filters: parsedFilters,
      });

      const result = await dbService.getAllRecords(this.collectionName, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search,
        filters: parsedFilters,
      });

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({
        success: false,
        error: `Failed to fetch data from ${this.collectionName}`,
        details: error.message,
      });
    }
  };

  // Bulk Update records */
  bulkUpdate = async (request, reply) => {
    try {
      const { ids, data } = request.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return reply.code(400).send({
          success: false,
          error: "Invalid or empty IDs array",
        });
      }

      request.log.info({
        msg: `Bulk updating records in ${this.collectionName}`,
        count: ids.length,
      });

      const modifiedCount = await dbService.bulkUpdateRecords(
        this.collectionName,
        ids,
        data
      );

      return {
        success: true,
        modifiedCount,
        message: `Successfully updated ${modifiedCount} records`,
      };
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({
        success: false,
        error: "Failed to perform bulk update",
      });
    }
  };

  // Bulk Delete records */
  bulkDelete = async (request, reply) => {
    try {
      const { ids } = request.body;

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return reply.code(400).send({
          success: false,
          error: "Invalid or empty IDs array",
        });
      }

      request.log.info({
        msg: `Bulk deleting records from ${this.collectionName}`,
        count: ids.length,
      });

      const deletedCount = await dbService.bulkDeleteRecords(
        this.collectionName,
        ids
      );

      return {
        success: true,
        deletedCount,
        message: `Successfully deleted ${deletedCount} records`,
      };
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({
        success: false,
        error: "Failed to perform bulk delete",
      });
    }
  };

  // Get a single record by ID */
  getById = async (request, reply) => {
    try {
      const { id } = request.params;

      request.log.info({
        msg: `Fetching record by ID from ${this.collectionName}`,
        id,
      });

      const record = await dbService.getRecordById(this.collectionName, id);

      if (!record) {
        request.log.warn({
          msg: `Record not found in ${this.collectionName}`,
          id,
        });

        return reply.code(404).send({
          success: false,
          error: "Record not found",
        });
      }

      return {
        success: true,
        data: record,
      };
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({
        success: false,
        error: "Failed to fetch record",
      });
    }
  };

  // Create a new record */
  create = async (request, reply) => {
    try {
      let data = request.body;

      request.log.info({
        msg: `Creating new record in ${this.collectionName}`,
        data: { ...data, ...{ largeDataOmitted: true } },
      });

      // Execute pre-save hook
      data = await this.preSave(data);

      const result = await dbService.createRecord(this.collectionName, data);

      // Execute post-save hook
      await this.postSave(data, result);

      request.log.info({
        msg: `Record created successfully in ${this.collectionName}`,
        id: result._id,
      });

      return reply.code(201).send({
        success: true,
        data: result,
      });
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({
        success: false,
        error: "Failed to create record",
      });
    }
  };

  // Update a record by ID */
  updateById = async (request, reply) => {
    try {
      const { id } = request.params;
      let data = request.body;

      request.log.info({
        msg: `Updating record in ${this.collectionName}`,
        id,
      });

      // Execute pre-update hook
      data = await this.preUpdate(id, data);

      const result = await dbService.updateRecord(
        this.collectionName,
        id,
        data
      );

      if (!result) {
        request.log.warn({
          msg: `Record to update not found in ${this.collectionName}`,
          id,
        });

        return reply.code(404).send({
          success: false,
          error: "Record not found",
        });
      }

      // Execute post-update hook
      await this.postUpdate(id, result);

      request.log.info({
        msg: `Record updated successfully in ${this.collectionName}`,
        id,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({
        success: false,
        error: "Failed to update record",
      });
    }
  };

  // Delete a record by ID */
  deleteById = async (request, reply) => {
    try {
      const { id } = request.params;

      request.log.info({
        msg: `Deleting record from ${this.collectionName}`,
        id,
      });

      const success = await dbService.deleteRecord(this.collectionName, id);

      if (!success) {
        request.log.warn({
          msg: `Record to delete not found in ${this.collectionName}`,
          id,
        });

        return reply.code(404).send({
          success: false,
          error: "Record not found",
        });
      }

      request.log.info({
        msg: `Record deleted successfully from ${this.collectionName}`,
        id,
      });

      return {
        success: true,
        message: "Record deleted successfully",
      };
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({
        success: false,
        error: "Failed to delete record",
      });
    }
  };
}
