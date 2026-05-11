import React from 'react'
import { RotateCcw } from 'lucide-react'
import InfoCard from '../../../Shared/InfoCard/InfoCard'
import { ReusableFilter } from '../../../Shared/ReusableFilter/ReusableFilter'
import { InventoryLoading } from '../../../Components/UI/LoadingAnimation'
import { 
  AutoReorderHeader, 
  StatsCards, 
  ActionButtons, 
  SuggestionsTable, 
  GenerateAllModal 
} from './components'
import { useReorderSuggestions } from './hooks'

const AutoReorderSuggestions = () => {
  const {
    // State
    loading,
    stats,
    filteredSuggestions,
    filterConfig,
    selectedItems,
    showGenerateModal,
    suppliers,
    filters,
    
    // Actions
    fetchData,
    handleAddToPO,
    handleGenerateConfirm,
    handleFilterChange,
    handleClearFilters,
    handleSelectAll,
    handleDeselectAll,
    handleGenerateAll,
    handleExport,
    setShowGenerateModal
  } = useReorderSuggestions()

  if (loading) {
    return <InventoryLoading message="Generating reorder suggestions..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AutoReorderHeader
        onGenerateAll={handleGenerateAll}
        onRefresh={fetchData}
        hasSuggestions={filteredSuggestions.length > 0}
      />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Info Card */}
      <InfoCard
        type="info"
        title="Smart Reorder System"
        message="Our AI analyzes your sales patterns, current stock levels, and lead times to suggest optimal reorder quantities. High priority items need immediate attention, while medium and low priority items can be planned for future orders."
        icon={RotateCcw}
      />

      {/* Action Buttons */}
      <ActionButtons
        selectedCount={selectedItems.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />

      {/* Filters */}
      <ReusableFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        filterConfig={filterConfig}
        title="Suggestion Filters"
        resultsCount={filteredSuggestions.length}
        totalCount={filteredSuggestions.length}
      />

      {/* Suggestions Table */}
      <SuggestionsTable
        suggestions={filteredSuggestions}
        suppliers={suppliers}
        loading={loading}
        onAddToPO={handleAddToPO}
      />

      {/* Generate All Modal */}
      <GenerateAllModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        selectedItems={selectedItems}
        suppliers={suppliers}
        onConfirm={handleGenerateConfirm}
      />
    </div>
  )
}

export default AutoReorderSuggestions
