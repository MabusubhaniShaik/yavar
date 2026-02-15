import { useState, useEffect } from "react";
import { useTableStore } from "../store/tableStore";
import { updateRecord } from "../services/api";
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

export function EditRecordModal() {
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    editingRecord,
    schema,
    getCurrentEndpoint,
    data,
    setData,
  } = useTableStore();

  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingRecord) {
      setFormData({ ...editingRecord });
    }
  }, [editingRecord]);

  if (!schema) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const id = editingRecord?._id || editingRecord?.id;
      if (!id) throw new Error("No record ID found");

      const endpoint = getCurrentEndpoint().replace("/slow", "");

      const updatedRecord = await updateRecord(endpoint, id, formData);

      const newData = data.map((item) => {
        const itemId = item._id || item.id;
        return itemId === id ? { ...item, ...updatedRecord.data } : item;
      });

      setData(newData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update record:", error);
      alert("Failed to update record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsEditModalOpen(open);
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schema.columns.map((column) => (
              <div
                key={column.key}
                className={column.type === "text" ? "col-span-2" : ""}
              >
                <Label htmlFor={column.key} className="text-right">
                  {column.label}
                </Label>
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
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
