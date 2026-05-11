import React from 'react'
import { CheckCircle } from 'lucide-react'
import Button from '../../../../Components/UI/Button'

const ActionButtons = ({ 
  selectedCount, 
  onSelectAll, 
  onDeselectAll 
}) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="secondary"
        size="md"
        onClick={onSelectAll}
      >
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Select All
        </div>
      </Button>
      <Button
        variant="secondary"
        size="md"
        onClick={onDeselectAll}
      >
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Deselect All
        </div>
      </Button>
      <div className="text-sm text-gray-600">
        {selectedCount} items selected
      </div>
    </div>
  )
}

export default ActionButtons
