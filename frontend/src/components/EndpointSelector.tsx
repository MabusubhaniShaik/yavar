import { useTableStore } from "@/store/tableStore";
import { Button } from "@/components/ui/button";
import { Database, Zap } from "lucide-react";

const DATASETS = [
  { id: "netflix", name: "Netflix Shows" },
  { id: "hr-analytics", name: "IBM HR Analytics" },
  { id: "sales", name: "Sample Sales Data" },
];

export function EndpointSelector() {
  const {
    selectedDataset,
    setSelectedDataset,
    isSlowEndpoint,
    setIsSlowEndpoint,
    setCurrentPage,
  } = useTableStore();

  const handleDatasetChange = (datasetId: string) => {
    setSelectedDataset(datasetId);
    setCurrentPage(1);
  };

  const handleSpeedToggle = () => {
    setIsSlowEndpoint(!isSlowEndpoint);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-between items-start md:items-center">
      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Select Dataset
        </h3>
        <div className="flex flex-wrap gap-2">
          {DATASETS.map((dataset) => (
            <Button
              key={dataset.id}
              variant={selectedDataset === dataset.id ? "default" : "outline"}
              onClick={() => handleDatasetChange(dataset.id)}
              className="justify-start"
            >
              <Database className="mr-2 h-4 w-4" />
              {dataset.name}
            </Button>
          ))}
        </div>
      </div>

      {selectedDataset && (
        <div className="flex-1 space-y-2 md:text-right">
          <h3 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Network Simulation
          </h3>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <Button
              variant={!isSlowEndpoint ? "secondary" : "outline"}
              onClick={() => {
                setIsSlowEndpoint(false);
                setCurrentPage(1);
              }}
              size="sm"
            >
              Normal Speed
            </Button>
            <Button
              variant={isSlowEndpoint ? "destructive" : "outline"}
              onClick={handleSpeedToggle}
              size="sm"
            >
              <Zap className="mr-2 h-4 w-4" />
              Simulate Slow Network (5-10s)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
