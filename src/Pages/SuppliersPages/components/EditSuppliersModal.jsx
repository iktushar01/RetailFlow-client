import React, { useState, useRef } from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { EditSuppliersForm } from './EditSuppliersForm'
import Button from '../../../Components/UI/Button'
import { suppliersAPI } from '../services/supplierService'
import Swal from 'sweetalert2'

const EditSuppliersModal = ({ isOpen, onClose, onSuccess, supplierData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  // Don't render modal if supplierData is not available
  if (!supplierData) {
    return null
  }

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      // Get the supplier ID
      const supplierId = supplierData._id || supplierData.id;
      
      // Put data to your API
      const response = await suppliersAPI.update(supplierId, values);
      console.log("Update Supplier response:", response);
      
      // Show success message with SweetAlert2
      await Swal.fire({
        title: 'Success!',
        text: 'Supplier updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true
      });
      
      // Call success callback if provided - pass the updated data with original ID
      if (onSuccess) {
        const updatedData = {
          ...supplierData, // Keep original data
          ...values, // Override with new values
          _id: supplierData._id, // Ensure ID is preserved
          id: supplierData.id
        };
        onSuccess(updatedData)
      }
      
      // Close modal after successful submission
      onClose()
    } catch (error) {
      console.error('Error updating supplier:', error)
      // Show error message with SweetAlert2
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message || 'Failed to update supplier',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      })
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
    <div className="flex justify-end space-x-3">
      <Button
        variant="secondary"
        size="md"
        onClick={onClose}
        disabled={isSubmitting}
      >
        <div className="flex items-center">
          Cancel
        </div>
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={handleUpdateClick}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        <div className="flex items-center">
          {isSubmitting ? 'Updating Supplier...' : 'Update Supplier'}
        </div>
      </Button>
    </div>
  )

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Supplier"
      size="large"
      footer={modalFooter}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <div className="max-h-96 overflow-y-auto">
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
