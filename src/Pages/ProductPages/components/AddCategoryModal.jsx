import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../Components/UI/Dialog"
import { Button } from '../../../Components/UI/button'
import { Input } from "../../../Components/UI/Input"
import { Label } from "../../../Components/UI/label"
import { Loader2 } from "lucide-react"
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
      // Simulate API call or logic
      if (onCategoryAdded) {
        onCategoryAdded(categoryName)
      }

      await Swal.fire({
        title: 'Success!',
        text: `Category "${categoryName}" added successfully!`,
        icon: 'success',
        confirmButtonColor: 'hsl(var(--primary))',
        timer: 1500,
        showConfirmButton: false
      })

      handleClose()
    } catch (err) {
      console.error('Error adding category:', err)
      setError('Failed to add category. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setCategoryName('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold leading-none tracking-tight">
            Add New Category
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pt-2">
            Add a new product category to your inventory. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid w-full items-center gap-2">
            <Label 
              htmlFor="categoryName" 
              className={error ? "text-destructive" : "text-foreground"}
            >
              Category Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="categoryName"
              placeholder="e.g. Furniture, Electronics..."
              value={categoryName}
              disabled={isSubmitting}
              autoFocus
              className={error ? "border-destructive focus-visible:ring-destructive" : ""}
              onChange={(e) => {
                setCategoryName(e.target.value)
                if (error) setError('')
              }}
            />
            {error && (
              <p className="text-[0.8rem] font-medium text-destructive">
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Category'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddCategoryModal
