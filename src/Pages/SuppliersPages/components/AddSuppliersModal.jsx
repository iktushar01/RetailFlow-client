import React, { useState, useRef } from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { AddSuppliersFrom } from './AddSuppliersFrom'
import { Button } from '../../../Components/UI/Button'
import { suppliersAPI } from '../services/supplierService'
import { X, UserPlus, AlertCircle } from 'lucide-react'
import Swal from 'sweetalert2'

const AddSuppliersModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef(null)

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true)
    try {
      const response = await suppliersAPI.create(values);
      
      // We use a toast-style success for a more modern dashboard feel
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      await Toast.fire({
        icon: 'success',
        title: 'Entity Registered',
        text: `${values.supplierName} added to system.`
      });
      
      if (onSuccess) onSuccess(response)
      onClose()
    } catch (error) {
      console.error('Supplier Creation Error:', error)
      Swal.fire({
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Database rejected the entry.',
        icon: 'error',
        confirmButtonColor: 'oklch(var(--destructive))',
      })
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
        <span className="text-[10px] font-bold uppercase tracking-wider">Required fields must be valid</span>
      </div>
      <div className="flex gap-3">
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl hover:bg-muted font-bold uppercase text-[11px] tracking-widest"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveClick}
          loading={isSubmitting}
          disabled={isSubmitting}
          className="rounded-xl px-8 shadow-lg shadow-primary/20 font-bold uppercase text-[11px] tracking-widest"
        >
          {isSubmitting ? 'Processing...' : 'Confirm Registration'}
        </Button>
      </div>
    </div>
  )

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <UserPlus className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-black italic uppercase tracking-tighter">
            New <span className="text-primary/70">Supplier</span>
          </span>
        </div>
      }
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