import React, { useState, useMemo, useEffect, useCallback } from "react";
import { SharedTable } from "../../../Shared/SharedTable/SharedTable";
import { Button } from "../../../Components/UI/Button";
import { Edit, Trash2, Mail, Phone, Calendar, ShieldCheck, Building2 } from "lucide-react";
import SuppliersFilter from "./SuppliersFilter";
import EditSuppliersModal from "./EditSuppliersModal";
import { suppliersAPI } from "../services/supplierService";
import { 
  applySupplierFilters, 
  getSupplierStatusColor, 
  getPaymentTermsDisplay,
  formatDate 
} from "../utils/supplierHelpers";
import Swal from 'sweetalert2';

const SuppliersList = () => {
  const [suppliersData, setSuppliersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    paymentTerms: '',
    search: ''
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
      console.error('Fetch Error:', err);
      setError(err.response?.data?.message || 'Protocol connection failed.');
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
      header: "Entity / Identity", 
      accessorKey: "supplierName",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary/60" />
          </div>
          <div>
            <div className="font-bold text-foreground tracking-tight uppercase text-xs italic">
              {row.original.supplierName}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">
              ID: {row.original._id?.slice(-6)}
            </div>
          </div>
        </div>
      )
    },
    { 
      header: "Primary Contact", 
      accessorKey: "contactPerson",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-foreground/80">{row.original.contactPerson || '---'}</div>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase font-medium tracking-wide">
            <Mail className="w-3 h-3" /> {row.original.email || 'N/A'}
          </div>
        </div>
      )
    },
    { 
      header: "Contact Intelligence", 
      accessorKey: "phone",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 text-xs font-mono text-foreground/70">
          <Phone className="w-3 h-3 text-primary/40" /> {getValue() || '---'}
        </div>
      )
    },
    { 
      header: "Agreement Terms", 
      accessorKey: "paymentTerms",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" />
          <span className="text-xs font-bold text-foreground/80">{getPaymentTermsDisplay(getValue())}</span>
        </div>
      )
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        const colorClasses = getSupplierStatusColor(status);
        return (
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-300 shadow-sm ${colorClasses}`}>
            {status}
          </span>
        );
      }
    },
    { 
      header: "Registry Date", 
      accessorKey: "createdAt",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-tighter italic">
          <Calendar className="w-3 h-3" /> {formatDate(getValue())}
        </div>
      )
    }
  ];

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (supplier) => {
    const result = await Swal.fire({
      title: 'CONFIRM REMOVAL',
      text: `Terminate supplier record for "${supplier.supplierName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'oklch(var(--destructive))',
      cancelButtonColor: 'oklch(var(--muted))',
      confirmButtonText: 'CONFIRM DELETE',
      customClass: {
        popup: 'rounded-3xl border shadow-2xl',
        confirmButton: 'rounded-xl uppercase tracking-widest text-xs font-bold',
        cancelButton: 'rounded-xl uppercase tracking-widest text-xs font-bold'
      }
    });

    if (result.isConfirmed) {
      try {
        await suppliersAPI.delete(supplier._id);
        // Optimized: Update local state instead of refetching the whole API
        setSuppliersData(prev => prev.filter(s => s._id !== supplier._id));
        
        Swal.fire({
          title: 'DELETED',
          text: 'Entity removed from secure registry.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      } catch {
        Swal.fire('Error', 'Deletion protocol failed.', 'error');
      }
    }
  };

  const handleEditSuccess = (updatedSupplier) => {
    setIsEditModalOpen(false);
    // Optimized: Update the specific item in state
    setSuppliersData(prev => 
      prev.map(s => s._id === updatedSupplier._id ? updatedSupplier : s)
    );
  };

  const renderRowActions = (supplier) => (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(supplier)}
        className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 text-primary/70"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(supplier)}
        className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 text-destructive/70"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  if (error) {
    return (
      <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-12 text-center animate-in zoom-in-95">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-black uppercase tracking-tighter italic text-destructive">Registry Error</h3>
        <p className="text-muted-foreground text-sm mb-6 uppercase tracking-widest">{error}</p>
        <Button variant="outline" onClick={fetchSuppliers} className="rounded-xl border-destructive/20 text-destructive">
          Retry Synchronization
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <SuppliersFilter
        filters={filters}
        onFilterChange={setFilters}
        suppliers={suppliersData}
        filteredSuppliers={filteredSuppliers}
        resultsCount={filteredSuppliers.length}
        totalCount={suppliersData.length}
      />

      <div className="bg-card border rounded-[2rem] shadow-sm overflow-hidden transition-all duration-500 hover:shadow-md">
        <div className="p-1"> {/* Tiny padding for internal border feel */}
          <SharedTable
            columns={columns}
            data={filteredSuppliers}
            pageSize={10}
            loading={loading}
            renderRowActions={renderRowActions}
            actionsHeader=""
            // Pass a custom row class if your SharedTable supports it to handle the "group" hover
            rowClassName="group border-b last:border-0 hover:bg-muted/30 transition-colors"
          />
        </div>
      </div>

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
