import { jest } from "@jest/globals";

const { getSchema, getAvailableDatasets } = await import("../schemas.js");

describe("Schemas", () => {
  it("should return netflix schema", () => {
    const schema = getSchema("netflix");
    expect(schema.name).toBe("Netflix Shows");
  });

  it("should return hr_analytics schema", () => {
    const schema = getSchema("hr_analytics");
    expect(schema.name).toBe("IBM HR Analytics");
  });

  it("should return sales schema", () => {
    const schema = getSchema("sales");
    expect(schema.name).toBe("Sample Sales Data");
  });

  it("should throw error for unknown dataset", () => {
    expect(() => getSchema("unknown")).toThrow(
      "Schema not found for dataset: unknown"
    );
  });

  it("should return all available datasets", () => {
    const datasets = getAvailableDatasets();
    expect(datasets).toHaveLength(3);
    expect(datasets).toContainEqual({ id: "netflix", name: "Netflix Shows" });
  });
});
