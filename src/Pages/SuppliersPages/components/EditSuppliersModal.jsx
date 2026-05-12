import React, { useState, useRef } from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import { EditSuppliersForm } from './EditSuppliersForm'
import { Button } from '../../../Components/UI/Button'
import { suppliersAPI } from '../services/supplierService'
import { FileEdit, AlertCircle, Save } from 'lucide-react'
import Swal from 'sweetalert2'

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
      
      // Modern Toast notification for subtle feedback
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
      })

      await Toast.fire({
        icon: 'success',
        title: 'Registry Updated',
        text: 'Changes synchronized successfully.'
      })
      
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
      Swal.fire({
        title: 'Update Rejected',
        text: error.response?.data?.message || 'The server could not process the update.',
        icon: 'error',
        confirmButtonColor: 'oklch(var(--destructive))'
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
    <div className="flex items-center justify-between w-full border-t pt-4 mt-">
      <div className="flex items-center gap-2 text-muted-foreground">
        <AlertCircle className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          All changes are logged in audit history
        </span>
      </div>
      <div className="flex gap-3">
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
          className="rounded-xl font-bold uppercase text-[11px] tracking-widest"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleUpdateClick}
          loading={isSubmitting}
          disabled={isSubmitting}
          className="rounded-xl px-8 shadow-lg shadow-primary/20 font-bold uppercase text-[11px] tracking-widest"
        >
          <Save className="w-3.5 h-3.5 mr-2" />
          {isSubmitting ? 'Syncing...' : 'Commit Changes'}
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
            <FileEdit className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-black italic uppercase tracking-tighter">
            Edit <span className="text-primary/70">Registry</span>
          </span>
        </div>
      }
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