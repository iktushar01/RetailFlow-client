import React, { useState, useMemo, useEffect, useCallback } from "react";
import { SharedTable } from "../../../Shared/SharedTable/SharedTable";
import { Button } from "../../../Components/UI/button";
import { Badge } from "@/Components/UI/badge";
import { Card } from "@/Components/UI/card";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import SuppliersFilter from "./SuppliersFilter";
import EditSuppliersModal from "./EditSuppliersModal";
import { suppliersAPI } from "../services/supplierService";
import {
  applySupplierFilters,
  formatDate,
  toSupplierApiPayload,
} from "../utils/supplierHelpers";
import { notify } from "../../../utils/notifications";
import { confirmDialog } from "../../../utils/confirmDialog";
import { cn } from "@/lib/utils";

const statusStyles = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inactive: "bg-slate-100 text-slate-700 border-slate-200",
  Suspended: "bg-red-100 text-red-700 border-red-200",
};

const SuppliersList = () => {
  const [suppliersData, setSuppliersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    paymentTerms: "",
    search: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await suppliersAPI.getAll();
      setSuppliersData(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load suppliers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const filteredSuppliers = useMemo(() => {
    return applySupplierFilters(suppliersData, filters);
  }, [suppliersData, filters]);

  const columns = [
    {
      header: "Supplier Name",
      accessorKey: "supplierName",
      cell: ({ getValue }) => <span>{getValue() || "N/A"}</span>,
    },
    {
      header: "Contact Person",
      accessorKey: "contactPerson",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue() || "N/A"}</span>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue() || "N/A"}</span>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: ({ getValue }) => <span>{getValue() || "N/A"}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue() || "Active";
        return (
          <Badge
            variant="outline"
            className={cn(
              "font-normal normal-case",
              statusStyles[status] || "bg-muted text-muted-foreground"
            )}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{formatDate(getValue())}</span>
      ),
    },
  ];

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (supplier) => {
    const confirmed = await confirmDialog({
      title: "Delete supplier?",
      description: `Remove "${supplier.supplierName}" from your supplier list?`,
      confirmText: "Delete",
      variant: "destructive",
    });

    if (!confirmed) return;

    try {
      await suppliersAPI.delete(supplier._id);
      setSuppliersData((prev) => prev.filter((s) => s._id !== supplier._id));
      notify.success("Deleted", "Supplier removed successfully.");
    } catch (err) {
      notify.error(
        "Delete failed",
        err.response?.data?.message || "Could not delete this supplier."
      );
    }
  };

  const handleEditSuccess = (updatedSupplier) => {
    setIsEditModalOpen(false);
    setSuppliersData((prev) =>
      prev.map((s) => (s._id === updatedSupplier._id ? updatedSupplier : s))
    );
  };

  const renderRowActions = (supplier) => (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(supplier)}
        className="h-8 px-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
      >
        <Edit className="w-4 h-4 mr-1" />
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(supplier)}
        className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Delete
      </Button>
    </div>
  );

  if (error) {
    return (
      <div className="border border-destructive/20 rounded-lg p-8 text-center">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
        <h3 className="text-base font-semibold text-destructive">Could not load suppliers</h3>
        <p className="text-muted-foreground text-sm mb-4">{error}</p>
        <Button variant="outline" onClick={fetchSuppliers}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SuppliersFilter
        filters={filters}
        onFilterChange={(key, value) => setFilters((prev) => ({ ...prev, [key]: value }))}
        onClearFilters={() => setFilters({ status: "", paymentTerms: "", search: "" })}
        suppliers={suppliersData}
        filteredSuppliers={filteredSuppliers}
        resultsCount={filteredSuppliers.length}
        totalCount={suppliersData.length}
      />

      <Card className="overflow-hidden border shadow-none">
        <SharedTable
          embedded
          columns={columns}
          data={filteredSuppliers}
          pageSize={10}
          loading={loading}
          renderRowActions={renderRowActions}
          actionsHeader="Actions"
        />
      </Card>

      <EditSuppliersModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        supplierData={selectedSupplier}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default SuppliersList;
