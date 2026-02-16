import { useTableStore } from "@/store/tableStore";
import { deleteRecord, bulkDeleteRecords } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pencil,
  Trash2,
  CheckSquare,
  Square,
  XCircle,
  Edit3,
} from "lucide-react";
import { AdvancedFilter } from "./AdvancedFilter";
import { BulkEditModal } from "./BulkEditModal";
import { cn } from "@/lib/utils";

export function DynamicTable() {
  const {
    schema,
    data,
    isLoading,
    isSchemaLoading,
    columnWidths,
    getCurrentEndpoint,
    setEditingRecord,
    setIsEditModalOpen,
    selectedIds,
    setSelectedIds,
    toggleSelectId,
    clearSelection,
    setIsBulkEditModalOpen,
    refresh,
  } = useTableStore();

  const handleDelete = async (record: any) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const id = record._id || record.id;
      const endpoint = getCurrentEndpoint().replace("/slow", "");

      await deleteRecord(endpoint, id);
      refresh();
    } catch (error) {
      console.error("Failed to delete record:", error);
      alert("Failed to delete record");
    }
  };

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} records?`
      )
    )
      return;

    try {
      const endpoint = getCurrentEndpoint().replace("/slow", "");
      await bulkDeleteRecords(endpoint, selectedIds);
      clearSelection();
      refresh();
      alert(`Successfully deleted ${selectedIds.length} records`);
    } catch (error) {
      console.error("Bulk delete failed:", error);
      alert("Failed to perform bulk delete");
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === data.length && data.length > 0) {
      clearSelection();
    } else {
      setSelectedIds(data.map((row) => row._id || row.id));
    }
  };

  if (isSchemaLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-full" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground border rounded-md bg-muted/10">
        Select a dataset to view data
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <AdvancedFilter />

        {/* Bulk Actions Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-right-4 duration-300">
            <span className="text-sm font-semibold text-blue-700">
              {selectedIds.length} items selected
            </span>
            <div className="h-4 w-px bg-blue-200 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-blue-700 hover:bg-blue-100 flex gap-2"
              onClick={() => setIsBulkEditModalOpen(true)}
            >
              <Edit3 className="h-4 w-4" /> Bulk Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-red-600 hover:bg-red-100 flex gap-2"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4" /> Bulk Delete
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-400 hover:text-blue-600"
              onClick={clearSelection}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-xl border shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-12 text-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleSelectAll}
                >
                  {selectedIds.length === data.length && data.length > 0 ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </TableHead>
              {schema.columns.map((column) => (
                <TableHead
                  key={column.key}
                  style={{
                    width: columnWidths[column.key] || column.width,
                    minWidth: columnWidths[column.key] || column.width,
                  }}
                  className="font-semibold text-gray-700"
                >
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-right w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </TableCell>
                  {schema.columns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Skeleton className="h-6 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={schema.columns.length + 2}
                  className="h-32 text-center text-gray-400 italic"
                >
                  No records found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const id = row._id || row.id;
                const isSelected = selectedIds.includes(id);
                return (
                  <TableRow
                    key={id}
                    className={cn(
                      "transition-colors",
                      isSelected && "bg-blue-50/30 hover:bg-blue-50/50"
                    )}
                  >
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleSelectId(id)}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-300" />
                        )}
                      </Button>
                    </TableCell>
                    {schema.columns.map((column) => (
                      <TableCell
                        key={column.key}
                        style={{
                          width: columnWidths[column.key] || column.width,
                          minWidth: columnWidths[column.key] || column.width,
                        }}
                      >
                        <div
                          className="truncate font-medium text-gray-900"
                          title={row[column.key]}
                        >
                          {row[column.key] || "-"}
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleEdit(row)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <BulkEditModal />
    </div>
  );
}
