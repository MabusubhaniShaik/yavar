import { useState } from "react";
import { useTableStore } from "@/store/tableStore";
import { bulkUpdateRecords } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, AlertCircle } from "lucide-react";

export function BulkEditModal() {
  const {
    schema,
    selectedIds,
    isBulkEditModalOpen,
    setIsBulkEditModalOpen,
    getCurrentEndpoint,
    refresh,
    clearSelection,
  } = useTableStore();

  const [editFields, setEditFields] = useState<{ field: string; value: any }[]>([
    { field: schema?.columns[0].key || "", value: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!schema) return null;

  const handleAddField = () => {
    setEditFields([...editFields, { field: schema.columns[1].key || schema.columns[0].key, value: "" }]);
  };

  const handleRemoveField = (index: number) => {
    setEditFields(editFields.filter((_, i) => i !== index));
  };

  const handleUpdateField = (index: number, updates: any) => {
    const nextFields = [...editFields];
    nextFields[index] = { ...nextFields[index], ...updates };
    setEditFields(nextFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editFields.length === 0) return;

    setIsSubmitting(true);
    try {
      const endpoint = getCurrentEndpoint().replace("/slow", "");
      
      // Convert array of fields to a single object
      const updateData = editFields.reduce((acc, curr) => {
        if (curr.field) {
          acc[curr.field] = curr.value;
        }
        return acc;
      }, {} as any);

      await bulkUpdateRecords(endpoint, selectedIds, updateData);
      
      setIsBulkEditModalOpen(false);
      clearSelection();
      refresh();
      alert(`Successfully updated ${selectedIds.length} records`);
    } catch (error) {
      console.error("Bulk update failed:", error);
      alert("Failed to perform bulk update");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isBulkEditModalOpen} onOpenChange={setIsBulkEditModalOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Bulk Edit {selectedIds.length} Records
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 text-sm text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>You are about to update {selectedIds.length} records. These changes cannot be undone.</p>
          </div>

          <div className="space-y-3">
             {editFields.map((item, index) => (
              <div key={index} className="flex items-end gap-2 animate-in slide-in-from-right-2 duration-200">
                <div className="flex-1 space-y-1.5">
                  <Label>Field</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={item.field}
                    onChange={(e) => handleUpdateField(index, { field: e.target.value })}
                  >
                    {schema.columns.map((col) => (
                      <option key={col.key} value={col.key}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-[1.5] space-y-1.5">
                  <Label>New Value</Label>
                  <Input
                    value={item.value}
                    onChange={(e) => handleUpdateField(index, { value: e.target.value })}
                    placeholder="Enter new value..."
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mb-0.5 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveField(index)}
                  disabled={editFields.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full mt-2 border-dashed border-gray-300"
            onClick={handleAddField}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Field to Update
          </Button>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsBulkEditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Updating..." : `Update ${selectedIds.length} Records`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
