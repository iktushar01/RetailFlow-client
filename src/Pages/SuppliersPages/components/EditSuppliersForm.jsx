import React, { forwardRef, useMemo } from 'react'
import { 
  Building2, 
  UserCircle, 
  MapPin, 
  CreditCard, 
  ClipboardList, 
  Info,
  RefreshCcw
} from 'lucide-react'
import InputForm from '../../../Shared/InputForm/InputForm'
import { PAYMENT_TERMS_OPTIONS, STATUS_OPTIONS, SUPPLIER_CATEGORIES } from '../utils/supplierHelpers'

export const EditSuppliersForm = forwardRef(({ 
  onSubmit, 
  hideSubmitButton = false, 
  supplierData = {} 
}, ref) => {

  // Memoize fields to prevent unnecessary re-renders of the InputForm
  const fields = useMemo(() => [
    // --- IDENTITY SECTION ---
    { 
      name: 'supplierName', 
      label: 'Supplier Entity Name', 
      type: 'text', 
      icon: Building2,
      validation: { required: 'Supplier name is required' } 
    },
    { 
      name: 'contactPerson', 
      label: 'Point of Contact', 
      type: 'text', 
      icon: UserCircle,
      validation: { required: 'Contact person is required' } 
    },
    { name: 'phone', label: 'Primary Phone', type: 'text' },
    { name: 'email', label: 'Business Email', type: 'email' },

    // --- LOGISTICS SECTION ---
    { 
      name: 'address', 
      label: 'Operational Address', 
      type: 'text', 
      icon: MapPin,
      validation: { required: 'Address is required' } 
    },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'state', label: 'State/Province', type: 'text' },
    { name: 'zipCode', label: 'Postal Code', type: 'text' },
    { name: 'country', label: 'Country', type: 'text' },

    // --- STRATEGIC SECTION ---
    {
      name: 'paymentTerms',
      label: 'Payment Terms',
      type: 'select',
      icon: CreditCard,
      options: PAYMENT_TERMS_OPTIONS.map(term => ({ value: term, label: term })),
    },
    {
      name: 'categories',
      label: 'Supply Categories',
      type: 'select',
      icon: ClipboardList,
      options: SUPPLIER_CATEGORIES.map(category => ({ value: category, label: category })),
    },
    {
      name: 'status',
      label: 'Contract Status',
      type: 'select',
      icon: Info,
      options: STATUS_OPTIONS.map(status => ({ value: status, label: status })),
    },
    { 
      name: 'notes', 
      label: 'Strategic Notes', 
      type: 'textarea', 
      placeholder: 'Update internal relationship notes...',
      fullWidth: true 
    },
  ], [])

  // Null safety mapping with useMemo to keep it stable
  const defaultValues = useMemo(() => ({
    supplierName: supplierData?.supplierName || '',
    contactPerson: supplierData?.contactPerson || '',
    phone: supplierData?.phone || '',
    email: supplierData?.email || '',
    address: supplierData?.address || '',
    city: supplierData?.city || '',
    state: supplierData?.state || '',
    zipCode: supplierData?.zipCode || '',
    country: supplierData?.country || '',
    paymentTerms: supplierData?.paymentTerms || '',
    categories: supplierData?.categories || '',
    notes: supplierData?.notes || '',
    status: supplierData?.status || 'Active',
  }), [supplierData])

  const handleSubmit = async (values) => {
    if (onSubmit) {
      await onSubmit(values)
    } else {
      console.log('Update Payload Synchronized:', values)
    }
  }

  // Graceful loading state
  if (!supplierData || Object.keys(supplierData).length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 space-y-4 animate-pulse'>
        <RefreshCcw className='w-8 h-8 text-muted-foreground animate-spin' />
        <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground'>
          Synchronizing Supplier Data...
        </p>
      </div>
    )
  }

  return (
    <div className='animate-in fade-in slide-in-from-bottom-2 duration-400'>
      {/* Informational Context Header */}
      <div className='flex items-center gap-3 mb-8 p-4 bg-primary/5 border border-primary/10 rounded-2xl'>
        <div className='p-2 bg-primary/10 rounded-xl'>
          <RefreshCcw className='w-4 h-4 text-primary' />
        </div>
        <div>
          <h3 className='text-sm font-bold text-foreground uppercase tracking-tight'>
            Update Registry: {supplierData?.supplierName}
          </h3>
          <p className='text-[11px] text-muted-foreground font-medium uppercase tracking-wider'>
            Modifying records for UID: <span className='font-mono'>#{supplierData?._id?.slice(-6) || 'TEMP'}</span>
          </p>
        </div>
      </div>

      <InputForm
        ref={ref}
        fields={fields}
        defaultValues={defaultValues}
        submitLabel={hideSubmitButton ? '' : 'Commit Updates'}
        columns={2}
        onSubmit={handleSubmit}
        hideSubmitButton={hideSubmitButton}
      />
    </div>
  )
})

export default EditSuppliersForm
