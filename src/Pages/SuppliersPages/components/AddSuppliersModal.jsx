import React, { useState, useRef } from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { AddSuppliersFrom } from './AddSuppliersFrom'
import Button from '../../../Components/UI/Button'
import { suppliersAPI } from '../services/supplierService'
import Swal from 'sweetalert2'

const AddSuppliersModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const response = await suppliersAPI.create(values);
      console.log("Add Supplier response:", response);
      
      // Show success message with SweetAlert2
      await Swal.fire({
        title: 'Success!',
        text: 'Supplier added successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response)
      }
      
      // Close modal after successful submission
      onClose()
    } catch (error) {
      console.error('Error adding supplier:', error)
      // Show error message with SweetAlert2
      await Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || error.message || 'Failed to add supplier',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveClick = () => {
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
        onClick={handleSaveClick}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        <div className="flex items-center">
          {isSubmitting ? 'Adding Supplier...' : 'Add Supplier'}
        </div>
      </Button>
    </div>
  )

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Supplier"
      size="medium"
      footer={modalFooter}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <div className="max-h-96 overflow-y-auto">
        <AddSuppliersFrom 
          onSubmit={handleFormSubmit} 
          hideSubmitButton={true}
          ref={formRef}
        />
      </div>
    </SharedModal>
  )
}

export default AddSuppliersModal
