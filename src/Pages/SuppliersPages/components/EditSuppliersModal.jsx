import React, { useState, useRef } from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { EditSuppliersForm } from './EditSuppliersForm'
import { Button } from '../../../Components/UI/button'
import { suppliersAPI } from '../services/supplierService'
import { FileEdit, AlertCircle, Save } from 'lucide-react'
import { notify } from '../../../utils/notifications'

const EditSuppliersModal = ({ isOpen, onClose, onSuccess, supplierData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  // Avoid rendering issues if supplierData hasn't been passed yet
  if (!supplierData) return null

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const supplierId = supplierData._id || supplierData.id
      await suppliersAPI.update(supplierId, values)
      
      notify.success('Registry Updated', 'Changes synchronized successfully.', { duration: 2500 })
      
      if (onSuccess) {
        // Construct the updated object for the parent list
        const updatedData = {
          ...supplierData,
          ...values,
          _id: supplierId,
        }
        onSuccess(updatedData)
      }
      
      onClose()
    } catch (error) {
      console.error('Update Error:', error)
      notify.error(
        'Update Rejected',
        error.response?.data?.message || 'The server could not process the update.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit()
    }
  }

  const modalFooter = (
    <div className="flex items-center justify-between w-full border-t pt-4 mt-">
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="w-3.5 h-3.5" />
        <span className="text-sm text-muted-foreground">Changes are saved to the supplier record</span>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleUpdateClick} loading={isSubmitting} disabled={isSubmitting}>
          <Save className="w-3.5 h-3.5 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Supplier"
      size="lg"
      footer={modalFooter}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <div className="max-h-[70vh] overflow-y-auto px-1 pr-3 scrollbar-thin scrollbar-thumb-muted">
        <EditSuppliersForm 
          onSubmit={handleFormSubmit} 
          hideSubmitButton={true}
          ref={formRef}
          supplierData={supplierData}
        />
      </div>
    </SharedModal>
  )
}

export default EditSuppliersModal
