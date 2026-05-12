import React, { forwardRef } from 'react'
import { useForm } from 'react-hook-form'
import { cn } from "@/lib/utils"

// Shadcn UI Components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../Components/UI/Form"
import { Input } from "../../Components/UI/Input"
import { Button } from "../../Components/UI/Button"
import { Textarea } from "../../Components/UI/Textarea"
import { Checkbox } from "../../Components/UI/Checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/UI/Select"

const InputForm = forwardRef(({
  fields = [],
  defaultValues = {},
  onSubmit = () => {},
  submitLabel = 'Save',
  columns = 2,
  className = '',
  hideSubmitButton = false
}, ref) => {
  const form = useForm({ defaultValues })

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2'

  return (
    <Form {...form}>
      <form 
        ref={ref} 
        onSubmit={form.handleSubmit(onSubmit)} 
        className={cn("space-y-6", className)}
      >
        <div className={cn("grid gap-4", gridCols)}>
          {fields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              rules={field.validation}
              render={({ field: formField }) => (
                <FormItem className={cn(
                  field.type === 'checkbox' ? "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm" : "space-y-2",
                  field.className
                )}>
                  {field.type !== 'checkbox' && (
                    <FormLabel className="font-semibold text-foreground">
                      {field.label}
                      {field.validation?.required && <span className="text-destructive ml-1">*</span>}
                    </FormLabel>
                  )}

                  <FormControl>
                    {(() => {
                      switch (field.type) {
                        case 'select':
                          return (
                            <Select 
                              onValueChange={formField.onChange} 
                              defaultValue={formField.value}
                              disabled={field.disabled}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={field.placeholder || "Select..."} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options.map(opt => (
                                  <SelectItem 
                                    key={opt.value ?? opt} 
                                    value={String(opt.value ?? opt)}
                                  >
                                    {opt.label ?? opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )
                        case 'textarea':
                          return (
                            <Textarea 
                              {...formField} 
                              placeholder={field.placeholder} 
                              rows={field.rows}
                              disabled={field.disabled}
                            />
                          )
                        case 'checkbox':
                          return (
                            <>
                              <Checkbox
                                checked={formField.value}
                                onCheckedChange={formField.onChange}
                                disabled={field.disabled}
                              />
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  {field.label}
                                  {field.validation?.required && <span className="text-destructive ml-1">*</span>}
                                </FormLabel>
                                {field.description && <FormDescription>{field.description}</FormDescription>}
                              </div>
                            </>
                          )
                        case 'currency':
                        case 'number':
                          return (
                            <div className="flex items-center gap-2">
                              {field.prefix && <span className="text-sm text-muted-foreground">{field.prefix}</span>}
                              <Input 
                                {...formField}
                                type="number"
                                step={field.step || (field.type === 'currency' ? '0.01' : '1')}
                                min={field.min}
                                max={field.max}
                                placeholder={field.placeholder}
                                disabled={field.disabled}
                                onChange={(e) => formField.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                              />
                              {field.suffix && <span className="text-sm text-muted-foreground">{field.suffix}</span>}
                            </div>
                          )
                        default:
                          return (
                            <div className="flex items-center gap-2">
                              {field.prefix && <span className="text-sm text-muted-foreground">{field.prefix}</span>}
                              <Input 
                                {...formField} 
                                type={field.type || 'text'} 
                                placeholder={field.placeholder}
                                disabled={field.disabled}
                              />
                              {field.suffix && <span className="text-sm text-muted-foreground">{field.suffix}</span>}
                            </div>
                          )
                      }
                    })()}
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          ))}
        </div>

        {!hideSubmitButton && (
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting}
              className="px-8"
            >
              {form.formState.isSubmitting ? 'Processing...' : submitLabel}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
})

export default InputForm