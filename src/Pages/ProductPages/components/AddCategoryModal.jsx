import React, { useState } from 'react'
import SharedModal from '../../../Shared/SharedModal/SharedModal'
import Button from '../../../Components/UI/Button'
import Swal from 'sweetalert2'

const AddCategoryModal = ({ isOpen, onClose, onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!categoryName.trim()) {
      setError('Category name is required')
      return
    }

    setIsSubmitting(true)

    try {
      // Show success message
      await Swal.fire({
        title: 'Success!',
        text: `Category "${categoryName}" added successfully!`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        timerProgressBar: true
      })

      // Call the callback to add category to parent
      if (onCategoryAdded) {
        onCategoryAdded(categoryName)
      }

      // Reset and close
      setCategoryName('')
      setError('')
      onClose()
    } catch (error) {
      console.error('Error adding category:', error)
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to add category',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setCategoryName('')
    setError('')
    onClose()
  }

  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button
        variant="secondary"
        size="md"
        onClick={handleClose}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        size="md"
        onClick={handleSubmit}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add Category'}
      </Button>
    </div>
  )

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Category"
      size="small"
      footer={modalFooter}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Add a new product category to your inventory
          </p>
          
          <div className="space-y-1">
            <label 
              className="text-sm font-semibold text-gray-700" 
              htmlFor="categoryName"
            >
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              id="categoryName"
              type="text"
              placeholder="e.g. Furniture"
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value)
                if (error) setError('')
              }}
              className={`block w-full rounded-xl border ${
                error ? 'border-red-500' : 'border-gray-300'
              } hover:border-gray-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-3.5 py-2.5 text-sm placeholder-gray-400`}
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
          </div>
        </div>
      </form>
    </SharedModal>
  )
}

export default AddCategoryModal

