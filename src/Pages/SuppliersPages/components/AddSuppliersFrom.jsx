import React, { forwardRef, useMemo } from 'react'
import { Building2, UserCircle, MapPin, CreditCard, ClipboardList, Info } from 'lucide-react'
import InputForm from '../../../Shared/InputForm/InputForm'
import { PAYMENT_TERMS_OPTIONS, STATUS_OPTIONS, SUPPLIER_CATEGORIES } from '../utils/supplierHelpers'

export const AddSuppliersFrom = forwardRef(({ onSubmit, hideSubmitButton = false }, ref) => {
  
  const fields = useMemo(() => [
    // --- SECTION: IDENTITY ---
    { 
      name: 'supplierName', 
      label: 'Supplier Entity Name', 
      type: 'text', 
      placeholder: 'e.g. Apex Global Logistics', 
      icon: Building2,
      validation: { required: 'Supplier name is required' } 
    },
    { 
      name: 'contactPerson', 
      label: 'Point of Contact', 
      type: 'text', 
      placeholder: 'e.g. Mr. Rahim', 
      icon: UserCircle,
      validation: { required: 'Contact person is required' } 
    },
    { 
      name: 'phone', 
      label: 'Primary Phone', 
      type: 'text', 
      placeholder: '+880 1XXXXXXXXX', 
      validation: { required: 'Phone number is required' } 
    },
    { 
      name: 'email', 
      label: 'Business Email', 
      type: 'email', 
      placeholder: 'procurement@supplier.com', 
      validation: { required: 'Email address is required' } 
    },

    // --- SECTION: LOGISTICS & LOCATION ---
    { 
      name: 'address', 
      label: 'Operational Address', 
      type: 'text', 
      placeholder: 'Suite, Street, Industrial Area', 
      icon: MapPin,
      validation: { required: 'Address is required' } 
    },
    { 
      name: 'city', 
      label: 'City', 
      type: 'text', 
      placeholder: 'City', 
      validation: { required: 'City is required' } 
    },
    { 
      name: 'state', 
      label: 'State/Province', 
      type: 'text', 
      placeholder: 'State', 
      validation: { required: 'State is required' } 
    },
    { 
      name: 'zipCode', 
      label: 'Postal Code', 
      type: 'text', 
      placeholder: 'ZIP Code', 
      validation: { required: 'ZIP code is required' } 
    },
    { 
      name: 'country', 
      label: 'Country of Origin', 
      type: 'text', 
      placeholder: 'Country', 
      validation: { required: 'Country is required' } 
    },

    // --- SECTION: CONTRACTUAL TERMS ---
    {
      name: 'paymentTerms',
      label: 'Payment Terms',
      type: 'select',
      icon: CreditCard,
      options: PAYMENT_TERMS_OPTIONS.map(term => ({ value: term, label: term })),
      validation: { required: 'Payment terms is required' },
    },
    {
      name: 'categories',
      label: 'Supply Categories',
      type: 'select',
      icon: ClipboardList,
      options: SUPPLIER_CATEGORIES.map(category => ({ value: category, label: category })),
      validation: { required: 'At least one category is required' },
    },
    {
      name: 'status',
      label: 'Contract Status',
      type: 'select',
      icon: Info,
      options: STATUS_OPTIONS.map(status => ({ value: status, label: status })),
      validation: { required: 'Status is required' },
    },
    { 
      name: 'notes', 
      label: 'Strategic Notes', 
      type: 'textarea', 
      placeholder: 'Contractual nuances, delivery preferences, or relationship history...',
      fullWidth: true // Added flag for better layout control if your InputForm supports it
    },
  ], [])

  const defaultValues = {
    supplierName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentTerms: '',
    categories: '',
    notes: '',
    status: 'Active',
  }

  const handleSubmit = async (values) => {
    if (onSubmit) {
      await onSubmit(values)
    } else {
      console.log('Supplier Enrollment Payload:', values)
    }
  }

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
      {/* Informational Header */}
      <div className='flex items-center gap-3 mb-8 p-4 bg-primary/5 border border-primary/10 rounded-2xl'>
        <div className='p-2 bg-primary/10 rounded-xl'>
          <Building2 className='w-5 h-5 text-primary' />
        </div>
        <div>
          <h3 className='text-sm font-bold text-foreground uppercase tracking-tight'>
            Supplier Enrollment
          </h3>
          <p className='text-[11px] text-muted-foreground font-medium uppercase tracking-wider'>
            Populate all required fields to register a new logistics entity
          </p>
        </div>
      </div>

      <div className="bg-card">
        <InputForm
          ref={ref}
          fields={fields}
          defaultValues={defaultValues}
          submitLabel={hideSubmitButton ? '' : 'Register Supplier'}
          columns={2}
          onSubmit={handleSubmit}
          hideSubmitButton={hideSubmitButton}
          className="gap-x-6 gap-y-4" // Assuming InputForm accepts tailwind classes
        />
      </div>
    </div>
  )
})

export default AddSuppliersFrom
