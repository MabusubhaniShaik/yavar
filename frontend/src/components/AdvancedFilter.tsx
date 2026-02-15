import { useState, useEffect } from "react";
import { useTableStore } from "@/store/tableStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const OPERATORS = [
  { label: "Equals", value: "equals" },
  { label: "Contains", value: "contains" },
  { label: "Starts With", value: "starts_with" },
  { label: "Ends With", value: "ends_with" },
  { label: "Greater Than", value: "gt" },
  { label: "Less Than", value: "lt" },
  { label: "Is Not", value: "not_equals" },
];

export function AdvancedFilter() {
  const { schema, advancedFilters, setAdvancedFilters } = useTableStore();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(advancedFilters);

  useEffect(() => {
    setLocalFilters(advancedFilters);
  }, [advancedFilters]);

  if (!schema) return null;

  const addCondition = () => {
    setLocalFilters({
      ...localFilters,
      conditions: [
        ...localFilters.conditions,
        { field: schema.columns[0].key, operator: "contains", value: "" },
      ],
    });
  };

  const removeCondition = (index: number) => {
    const newConditions = localFilters.conditions.filter((_, i) => i !== index);
    setLocalFilters({ ...localFilters, conditions: newConditions });
  };

  const updateCondition = (index: number, updates: any) => {
    const newConditions = [...localFilters.conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setLocalFilters({ ...localFilters, conditions: newConditions });
  };

  const applyFilters = () => {
    setAdvancedFilters(localFilters);
    // URL persistence logic will be handled in a central hook or App.tsx
  };

  const clearFilters = () => {
    const cleared = { logic: "AND" as const, conditions: [] };
    setLocalFilters(cleared);
    setAdvancedFilters(cleared);
  };

  const activeCount = localFilters.conditions.length;

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 transition-all",
          activeCount > 0 && "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
        )}
      >
        <Filter className="h-4 w-4" />
        Advanced Filters
        {activeCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-blue-500 text-white rounded-full">
            {activeCount}
          </span>
        )}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>

      {isOpen && (
        <div className="absolute top-12 left-0 z-50 w-[500px] p-4 bg-white border rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Advanced Filtering</h3>
            <div className="flex gap-2">
               <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                    localFilters.logic === "AND" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
                  )}
                  onClick={() => setLocalFilters({ ...localFilters, logic: "AND" })}
                >
                  AND
                </button>
                <button
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-all",
                    localFilters.logic === "OR" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
                  )}
                  onClick={() => setLocalFilters({ ...localFilters, logic: "OR" })}
                >
                  OR
                </button>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {localFilters.conditions.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm italic">
                No filters added yet. Click "Add Condition" to start.
              </div>
            ) : (
              localFilters.conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                  <select
                    className="flex h-9 w-[130px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={condition.field}
                    onChange={(e) => updateCondition(index, { field: e.target.value })}
                  >
                    {schema.columns.map((col) => (
                      <option key={col.key} value={col.key}>
                        {col.label}
                      </option>
                    ))}
                  </select>

                  <select
                    className="flex h-9 w-[110px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={condition.operator}
                    onChange={(e) => updateCondition(index, { operator: e.target.value })}
                  >
                    {OPERATORS.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>

                  <Input
                    placeholder="Value..."
                    className="flex-1"
                    value={condition.value}
                    onChange={(e) => updateCondition(index, { value: e.target.value })}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => removeCondition(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-4 border-t flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={addCondition} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              <Plus className="h-4 w-4 mr-1" /> Add Condition
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
              <Button size="sm" onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
