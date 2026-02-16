import { useState, useEffect } from "react";
import { useTableStore } from "@/store/tableStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

const OPERATORS = [
  { label: "Equals", value: "equals" },
  { label: "Contains", value: "contains" },
  { label: "Starts With", value: "starts_with" },
  { label: "Ends With", value: "ends_with" },
  { label: "Greater Than", value: "gt" },
  { label: "Less Than", value: "lt" },
  { label: "Is Not", value: "not_equals" },
] as const;

type OperatorValue = (typeof OPERATORS)[number]["value"];

type FilterCondition = {
  field: string;
  operator: OperatorValue;
  value: string;
};

type FilterState = {
  logic: "AND" | "OR";
  conditions: FilterCondition[];
};

export function AdvancedFilter() {
  const { schema, advancedFilters, setAdvancedFilters }: any = useTableStore();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] =
    useState<FilterState>(advancedFilters);

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

  const updateCondition = (
    index: number,
    updates: Partial<FilterCondition>
  ) => {
    const newConditions = [...localFilters.conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setLocalFilters({ ...localFilters, conditions: newConditions });
  };

  const applyFilters = () => {
    setAdvancedFilters(localFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const cleared: FilterState = { logic: "AND", conditions: [] };
    setLocalFilters(cleared);
    setAdvancedFilters(cleared);
    setIsOpen(false);
  };

  const activeCount = localFilters.conditions.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center gap-2",
            activeCount > 0 &&
              "border-primary bg-primary/5 text-primary hover:bg-primary/10"
          )}
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
              {activeCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[500px] p-0" align="start" sideOffset={8}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Advanced Filtering</h3>
            <div className="flex items-center gap-2">
              <div className="flex bg-muted p-1 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-xs",
                    localFilters.logic === "AND" && "bg-background shadow-sm"
                  )}
                  onClick={() =>
                    setLocalFilters({ ...localFilters, logic: "AND" })
                  }
                >
                  AND
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-7 px-3 text-xs",
                    localFilters.logic === "OR" && "bg-background shadow-sm"
                  )}
                  onClick={() =>
                    setLocalFilters({ ...localFilters, logic: "OR" })
                  }
                >
                  OR
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 max-h-[300px] overflow-y-auto">
          <div className="space-y-3">
            {localFilters.conditions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm italic">
                No filters added yet. Click "Add Condition" to start.
              </div>
            ) : (
              localFilters.conditions.map((condition, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    value={condition.field}
                    onValueChange={(value) =>
                      updateCondition(index, { field: value })
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {schema.columns.map((col: any) => (
                        <SelectItem key={col.key} value={col.key}>
                          {col.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={condition.operator}
                    onValueChange={(value: OperatorValue) =>
                      updateCondition(index, { operator: value })
                    }
                  >
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Value..."
                    className="flex-1"
                    value={condition.value}
                    onChange={(e) =>
                      updateCondition(index, { value: e.target.value })
                    }
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeCondition(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={addCondition}>
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
            <Button
              size="sm"
              onClick={applyFilters}
              className="bg-black text-white hover:bg-black/90"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
