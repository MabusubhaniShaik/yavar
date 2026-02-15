import { useDataFetching } from "./hooks/useDataFetching";
import { EndpointSelector } from "./components/EndpointSelector";
import { DynamicTable } from "./components/DynamicTable";
import { Pagination } from "./components/Pagination";
import { EditRecordModal } from "./components/EditRecordModal";
import { CreateRecordModal } from "./components/CreateRecordModal";
import { useTableStore } from "./store/tableStore";
import { Button } from "./components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

function App() {
  useDataFetching();

  const { schema, isLoading, setIsCreateModalOpen, refresh } = useTableStore();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dynamic Data Table</h1>
            <p className="text-muted-foreground">
              Select a dataset and explore data with dynamic schema-driven
              tables
            </p>
          </div>
          <div className="flex gap-2">
            {schema && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={refresh}
                  disabled={isLoading}
                  title="Refresh Data"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                </Button>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <EditRecordModal />
          <CreateRecordModal />

          <Card>
            <CardContent className="pt-6">
              <EndpointSelector />
            </CardContent>
          </Card>

          {schema && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  {schema.name}
                </CardTitle>
                {isLoading && (
                  <CardDescription>
                    Loading data... May take 5-10s for slow endpoints
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <DynamicTable />
                <Pagination />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
