import React, { useState, useRef } from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { AddSuppliersFrom } from './AddSuppliersFrom'
import { Button } from '../../../Components/UI/button'
import { suppliersAPI } from '../services/supplierService'
import { X, UserPlus, AlertCircle } from 'lucide-react'
import { notify } from '../../../utils/notifications'

const AddSuppliersModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const response = await suppliersAPI.create(values);
      
      notify.success('Entity Registered', `${values.supplierName} added to system.`, { duration: 3000 })
      
      if (onSuccess) onSuccess(response)
      onClose()
    } catch (error) {
      console.error('Supplier Creation Error:', error)
      notify.error(
        'Registration Failed',
        error.response?.data?.message || 'Database rejected the entry.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Programmatically trigger the form inside the forwardRef
  const handleSaveClick = () => {
    if (formRef.current) {
      // Triggering the custom submit method provided by your InputForm/ref
      formRef.current.requestSubmit()
    }
  }

  const modalFooter = (
    <div className="flex items-center justify-between w-full border-t pt-4 mt-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="w-3.5 h-3.5" />
        <span className="text-sm text-muted-foreground">Required fields must be filled</span>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSaveClick} loading={isSubmitting} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Supplier'}
        </Button>
      </div>
    </div>
  )

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Supplier"
      size="lg" // Increased to 'lg' for 2-column comfort
      footer={modalFooter}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      {/* 
         Enhanced container: 
         - Custom scrollbar styling 
         - Padding to prevent input focus outlines from being clipped
      */}
      <div className="max-h-[70vh] overflow-y-auto px-1 pr-3 scrollbar-thin scrollbar-thumb-muted">
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
