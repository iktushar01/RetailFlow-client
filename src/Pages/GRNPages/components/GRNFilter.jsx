import { ReusableFilter } from '@/Shared/ReusableFilter/ReusableFilter';
import React from 'react';

const GRNFilter = ({ 
  filters, 
  onFilterChange, 
  suppliers = [], 
  resultsCount = 0,
  totalCount = 0 
}) => {
  const filterConfig = [
    {
      type: 'search',
      key: 'search',
      label: 'Search GRN',
      placeholder: 'Search by GRN Number...'
    },
    {
      type: 'select',
      key: 'status',
      label: 'Status',
      placeholder: 'All Statuses',
      options: [
        { value: 'all', label: 'All Status' }, // Shadcn Select works best with non-empty strings
        { value: 'Pending', label: '🟡 Pending' },
        { value: 'Partially Received', label: '🟠 Partially Received' },
        { value: 'Received', label: '🟢 Received' },
        { value: 'Approved', label: '✅ Approved' }
      ]
    },
    {
      type: 'select',
      key: 'supplier',
      label: 'Supplier',
      placeholder: 'All Suppliers',
      options: [
        { value: 'all', label: 'All Suppliers' },
        ...suppliers.map(supplier => ({
          value: supplier._id,
          label: supplier.supplierName
        }))
      ]
    },
    {
      type: 'date',
      key: 'dateFrom',
      label: 'Date From',
    },
    {
      type: 'date',
      key: 'dateTo',
      label: 'Date To',
    }
  ];

  const handleClearFilters = () => {
    onFilterChange({
      status: 'all',
      supplier: 'all',
      poNumber: '',
      dateFrom: undefined,
      dateTo: undefined,
      search: ''
    });
  };

  const handleExport = () => {
    console.log('Export GRN data');
  };

  return (
    <ReusableFilter
      filters={filters}
      onFilterChange={(key, value) => onFilterChange({ ...filters, [key]: value })}
      onClearFilters={handleClearFilters}
      onExport={handleExport}
      filterConfig={filterConfig}
      title="Filter Goods Receive Notes"
      resultsCount={resultsCount}
      totalCount={totalCount}
    />
  );
};

export default GRNFilter;
