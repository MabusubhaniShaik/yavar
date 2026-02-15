import { useState } from "react";
import { useTableStore } from "../store/tableStore";
import { createRecord } from "../services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateRecordModal() {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    schema,
    getCurrentEndpoint,
  } = useTableStore();

  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!schema) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = getCurrentEndpoint().replace("/slow", "");

      await createRecord(endpoint, formData);

      alert("Record created successfully!");
      setIsCreateModalOpen(false);
      setFormData({});

      // Note: Ideal implementation would refetch data or update store.
      // For now we rely on user manually refreshing or navigating,
      // or we could trigger a refetch if we exposed that method from store/hook.
    } catch (error) {
      console.error("Failed to create record:", error);
      alert("Failed to create record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsCreateModalOpen(open);
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schema.columns.map((column) => (
              <div
                key={column.key}
                className={column.type === "text" ? "col-span-2" : ""}
              >
                <Label htmlFor={column.key}>{column.label}</Label>
                <Input
                  id={column.key}
                  value={formData[column.key] || ""}
                  onChange={(e) => {
                    const val =
                      column.type === "number"
                        ? e.target.value === ""
                          ? ""
                          : Number(e.target.value)
                        : e.target.value;
                    setFormData({ ...formData, [column.key]: val });
                  }}
                  type={column.type === "number" ? "number" : "text"}
                  step={column.type === "number" ? "any" : undefined}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
