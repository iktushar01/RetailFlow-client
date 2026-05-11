import React, { useState, useMemo, useEffect } from "react";
import { SharedTable } from "../../../Shared/SharedTable/SharedTable";
import Button from "../../../Components/UI/Button";
import { Edit, Trash2 } from "lucide-react";
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

  // Fetch suppliers data from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await suppliersAPI.getAll();
        setSuppliersData(data);
      } catch (err) {
        console.error('Error fetching suppliers:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch suppliers');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Apply filters
  const filteredSuppliers = useMemo(() => {
    return applySupplierFilters(suppliersData, filters);
  }, [suppliersData, filters]);

  const columns = [
    { 
      header: "Supplier Name", 
      accessorKey: "supplierName",
      cell: ({ getValue }) => (
        <div className="font-medium text-gray-900">{getValue()}</div>
      )
    },
    { 
      header: "Contact Person", 
      accessorKey: "contactPerson",
      cell: ({ getValue }) => (
        <div className="text-gray-700">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "Email", 
      accessorKey: "email",
      cell: ({ getValue }) => (
        <div className="text-blue-600">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "Phone", 
      accessorKey: "phone",
      cell: ({ getValue }) => (
        <div className="text-gray-700">{getValue() || 'N/A'}</div>
      )
    },
    { 
      header: "Payment Terms", 
      accessorKey: "paymentTerms",
      cell: ({ getValue }) => (
        <div className="text-gray-700">{getPaymentTermsDisplay(getValue())}</div>
      )
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue();
        const colorClasses = getSupplierStatusColor(status);
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClasses}`}>
            {status}
          </span>
        );
      }
    },
    { 
      header: "Created Date", 
      accessorKey: "createdAt",
      cell: ({ getValue }) => (
        <div className="text-gray-500 text-sm">{formatDate(getValue())}</div>
      )
    }
  ];

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (supplier) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Delete "${supplier.supplierName}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await suppliersAPI.delete(supplier._id);
        
        await Swal.fire({
          title: 'Deleted!',
          text: 'Supplier has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 2000,
          timerProgressBar: true
        });
        
        // Refresh the list
        const data = await suppliersAPI.getAll();
        setSuppliersData(data);
      } catch (error) {
        console.error('Error deleting supplier:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete supplier',
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);
    // Refresh the list
    try {
      const data = await suppliersAPI.getAll();
      setSuppliersData(data);
    } catch (error) {
      console.error('Error refreshing suppliers:', error);
    }
  };

  const renderRowActions = (supplier) => (
    <div className="flex items-center gap-2">
      <Button
        variant="edit"
        size="sm"
        onClick={() => handleEdit(supplier)}
        title="Edit Supplier"
      >
        <div className="flex items-center">
          <Edit className="w-4 h-4 mr-1" />
          <span>Edit</span>
        </div>
      </Button>
      <Button
        variant="delete"
        size="sm"
        onClick={() => handleDelete(supplier)}
        title="Delete Supplier"
      >
        <div className="flex items-center">
          <Trash2 className="w-4 h-4 mr-1" />
          <span>Delete</span>
        </div>
      </Button>
    </div>
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium">Error: {error}</p>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <SuppliersFilter
        filters={filters}
        onFilterChange={setFilters}
        suppliers={suppliersData}
        filteredSuppliers={filteredSuppliers}
        resultsCount={filteredSuppliers.length}
        totalCount={suppliersData.length}
      />

      {/* Suppliers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <SharedTable
          columns={columns}
          data={filteredSuppliers}
          pageSize={10}
          loading={loading}
          renderRowActions={renderRowActions}
          actionsHeader="Actions"
        />
      </div>

      {/* Edit Modal */}
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
