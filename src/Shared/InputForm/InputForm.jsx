import React, { forwardRef } from 'react'
import { useForm, Controller } from 'react-hook-form'

const InputForm = forwardRef(({
  fields = [],
  defaultValues = {},
  onSubmit = () => {},
  submitLabel = 'Save',
  columns = 2,
  className = '',
  hideSubmitButton = false
}, ref) => {
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm({ defaultValues })

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2'

  const renderField = (field) => {
    const {
      name,
      label,
      type = 'text',
      placeholder,
      options = [],
      rows = 3,
      prefix,
      suffix,
      step,
      min,
      max,
      validation = {},
      disabled = false,
    } = field

    const error = errors?.[name]

    const baseInputClass = 'block w-full rounded-xl border border-slate-300 hover:border-slate-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 px-3.5 py-2.5 text-sm placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-400'

    if (type === 'select') {
      return (
        <div className="space-y-1" key={name}>
          {label && <label className="text-sm font-semibold text-slate-700" htmlFor={name}>
            {label} {validation?.required && <span className="text-red-500">*</span>}
          </label>}
          <select id={name} className={baseInputClass} disabled={disabled} {...register(name, validation)}>
            <option value="" disabled={!!validation?.required}>Select...</option>
            {options.map(opt => (
              <option key={opt.value ?? opt} value={opt.value ?? opt}>{opt.label ?? opt}</option>
            ))}
          </select>
          {error && <p className="text-xs text-red-600">{error.message || 'This field is required'}</p>}
        </div>
      )
    }

    if (type === 'textarea') {
      return (
        <div className="space-y-1" key={name}>
          {label && <label className="text-sm font-semibold text-slate-700" htmlFor={name}>
            {label} {validation?.required && <span className="text-red-500">*</span>}
          </label>}
          <textarea id={name} rows={rows} placeholder={placeholder} className={baseInputClass} disabled={disabled} {...register(name, validation)} />
          {error && <p className="text-xs text-red-600">{error.message || 'This field is required'}</p>}
        </div>
      )
    }

    if (type === 'checkbox') {
      return (
        <div className="flex items-center gap-2" key={name}>
          <input id={name} type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" disabled={disabled} {...register(name, validation)} />
          {label && <label className="text-sm text-slate-700" htmlFor={name}>
            {label} {validation?.required && <span className="text-red-500">*</span>}
          </label>}
          {error && <p className="text-xs text-red-600">{error.message || 'This field is required'}</p>}
        </div>
      )
    }

    if (type === 'currency') {
      // Simple currency input using Controller to preserve numeric value
      return (
        <div className="space-y-1" key={name}>
          {label && <label className="text-sm font-semibold text-slate-700" htmlFor={name}>
            {label} {validation?.required && <span className="text-red-500">*</span>}
          </label>}
          <Controller
            control={control}
            name={name}
            rules={validation}
            render={({ field: f }) => (
              <div className="flex items-center gap-2">
                {prefix && <span className="text-sm text-slate-500">{prefix}</span>}
                <input
                  id={name}
                  type="number"
                  inputMode="decimal"
                  step={step ?? '0.01'}
                  min={min}
                  max={max}
                  placeholder={placeholder}
                  className={baseInputClass}
                  disabled={disabled}
                  value={f.value ?? ''}
                  onChange={(e) => {
                    const val = e.target.value
                    f.onChange(val === '' ? '' : Number(val))
                  }}
                />
                {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
              </div>
            )}
          />
          {error && <p className="text-xs text-red-600">{error.message || 'This field is required'}</p>}
        </div>
      )
    }

    // text | number | date
    return (
      <div className="space-y-1" key={name}>
        {label && <label className="text-sm font-semibold text-slate-700" htmlFor={name}>
          {label} {validation?.required && <span className="text-red-500">*</span>}
        </label>}
        <div className="flex items-center gap-2">
          {prefix && <span className="text-sm text-slate-500">{prefix}</span>}
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            step={step}
            min={min}
            max={max}
            disabled={disabled}
            className={baseInputClass}
            {...register(name, validation)}
          />
          {suffix && <span className="text-sm text-slate-500">{suffix}</span>}
        </div>
        {error && <p className="text-xs text-red-600">{error.message || 'This field is required'}</p>}
      </div>
    )
  }

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${className}`}>
      <div className={`grid ${gridCols} gap-4`}>
        {fields.map(renderField)}
      </div>
      {!hideSubmitButton && (
        <div className="flex items-center justify-end gap-3">
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white px-4 py-2.5 text-sm font-semibold shadow hover:shadow-md transition hover:bg-indigo-700 disabled:opacity-60">
            {isSubmitting ? 'Processing…' : submitLabel}
          </button>
        </div>
      )}
    </form>
  )
})

export default InputForm