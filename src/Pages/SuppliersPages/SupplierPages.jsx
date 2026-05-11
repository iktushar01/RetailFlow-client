import React, { useState } from "react";
import { Plus, Users, Info } from "lucide-react";
import SuppliersList from "./components/SuppliersList";
import Button from "../../Components/UI/Button";
import InfoCard from "../../Shared/InfoCard/InfoCard";
import AddSuppliersModal from "./components/AddSuppliersModal";

const SupplierPages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSupplierAdded = (supplierData) => {
    console.log('New supplier added:', supplierData);
    // Trigger refresh of the suppliers list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
              Suppliers Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Manage and track your suppliers easily
            </p>
          </div>

          <Button 
            variant="primary" 
            size="sm"
            onClick={handleOpenModal}
            className="w-full sm:w-auto flex items-center justify-center"
          >
            <div className="flex items-center">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Add New Supplier</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Supplier Database Management"
        message="Maintain a comprehensive database of your suppliers with contact information, payment terms, and status tracking. Suppliers are linked to purchase orders, GRNs, and payments for complete supply chain visibility."
        icon={Info}
      />

      {/* Suppliers List */}
      <SuppliersList key={refreshKey} />
      
      {/* AddSuppliersModal */}
      <AddSuppliersModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSupplierAdded}
      />
    </div>
  );
};

export default SupplierPages;
