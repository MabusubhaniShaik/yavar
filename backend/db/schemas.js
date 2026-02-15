// Schema definitions for each dataset
// These define the structure, data types, and display properties for the dynamic table

export const schemas = {
  netflix: {
    name: "Netflix Shows",
    columns: [
      { key: "show_id", label: "Show ID", type: "string", width: 100 },
      { key: "type", label: "Type", type: "string", width: 100 },
      { key: "title", label: "Title", type: "string", width: 250 },
      { key: "director", label: "Director", type: "string", width: 180 },
      { key: "cast", label: "Cast", type: "string", width: 200 },
      { key: "country", label: "Country", type: "string", width: 150 },
      { key: "date_added", label: "Date Added", type: "date", width: 130 },
      {
        key: "release_year",
        label: "Release Year",
        type: "number",
        width: 120,
      },
      { key: "rating", label: "Rating", type: "string", width: 100 },
      { key: "duration", label: "Duration", type: "string", width: 120 },
      { key: "listed_in", label: "Genres", type: "string", width: 200 },
      { key: "description", label: "Description", type: "text", width: 300 },
    ],
  },

  hr_analytics: {
    name: "IBM HR Analytics",
    columns: [
      {
        key: "EmployeeNumber",
        label: "Employee #",
        type: "number",
        width: 120,
      },
      { key: "Age", label: "Age", type: "number", width: 80 },
      { key: "Attrition", label: "Attrition", type: "string", width: 100 },
      { key: "Department", label: "Department", type: "string", width: 150 },
      {
        key: "DistanceFromHome",
        label: "Distance",
        type: "number",
        width: 100,
      },
      { key: "Education", label: "Education", type: "number", width: 100 },
      {
        key: "EducationField",
        label: "Education Field",
        type: "string",
        width: 150,
      },
      { key: "Gender", label: "Gender", type: "string", width: 100 },
      { key: "JobRole", label: "Job Role", type: "string", width: 180 },
      {
        key: "JobSatisfaction",
        label: "Job Satisfaction",
        type: "number",
        width: 140,
      },
      {
        key: "MaritalStatus",
        label: "Marital Status",
        type: "string",
        width: 130,
      },
      {
        key: "MonthlyIncome",
        label: "Monthly Income",
        type: "number",
        width: 140,
      },
      {
        key: "PerformanceRating",
        label: "Performance",
        type: "number",
        width: 120,
      },
      {
        key: "YearsAtCompany",
        label: "Years at Company",
        type: "number",
        width: 150,
      },
    ],
  },

  sales: {
    name: "Sample Sales Data",
    columns: [
      { key: "ORDERNUMBER", label: "Order Number", type: "number", width: 130 },
      { key: "QUANTITYORDERED", label: "Quantity", type: "number", width: 100 },
      { key: "PRICEEACH", label: "Price Each", type: "number", width: 110 },
      {
        key: "ORDERLINENUMBER",
        label: "Line Number",
        type: "number",
        width: 120,
      },
      { key: "SALES", label: "Sales", type: "number", width: 120 },
      { key: "ORDERDATE", label: "Order Date", type: "date", width: 130 },
      { key: "STATUS", label: "Status", type: "string", width: 120 },
      { key: "PRODUCTLINE", label: "Product Line", type: "string", width: 150 },
      { key: "PRODUCTCODE", label: "Product Code", type: "string", width: 130 },
      {
        key: "CUSTOMERNAME",
        label: "Customer Name",
        type: "string",
        width: 200,
      },
      { key: "CITY", label: "City", type: "string", width: 130 },
      { key: "COUNTRY", label: "Country", type: "string", width: 130 },
      { key: "DEALSIZE", label: "Deal Size", type: "string", width: 110 },
    ],
  },
};

// Helper function to get schema by dataset name
export function getSchema(datasetName) {
  const schema = schemas[datasetName];
  if (!schema) {
    throw new Error(`Schema not found for dataset: ${datasetName}`);
  }
  return schema;
}

// Get all available datasets
export function getAvailableDatasets() {
  return Object.keys(schemas).map((key) => ({
    id: key,
    name: schemas[key].name,
  }));
}
