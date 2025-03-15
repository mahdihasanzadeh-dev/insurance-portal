import { useForm as useFormContext } from "@/context/form-context"
import { FormField } from "./form-field"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useState, forwardRef, useImperativeHandle } from "react"

export type DynamicFormRef = {
  validateForm: () => boolean
}

const DynamicForm = forwardRef<DynamicFormRef>((_, ref) => {
  const { formStructure, formValues } = useFormContext()
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})


  const shouldDisplay = (dependsOn?: { field: string; value: any }) => {
    if (!dependsOn) return true
    return formValues[dependsOn.field] === dependsOn.value
  }


  const validateForm = () => {
    const errors: Record<string, string> = {}

    formStructure?.sections.forEach((section) => {
      if (shouldDisplay(section.dependsOn)) {
        section.fields.forEach((field) => {
          if (shouldDisplay(field.dependsOn)) {
            const value = formValues[field.id]


            if (field.required && (value === undefined || value === null || value === '')) {
              errors[field.id] = `${field.label} is required`
              return
            }


            if (!value && !field.required) {
              return
            }

            if (field.validation?.pattern) {
              const regex = new RegExp(field.validation.pattern)
              if (!regex.test(value)) {
                errors[field.id] = `${field.label} format is invalid`
              }
            }

            if (field.type === 'number' && value !== '') {
              const numValue = Number(value)
              if (field.validation?.min !== undefined && numValue < field.validation.min) {
                errors[field.id] = `${field.label} must be at least ${field.validation.min}`
              }
              if (field.validation?.max !== undefined && numValue > field.validation.max) {
                errors[field.id] = `${field.label} must be at most ${field.validation.max}`
              }
            }

            if (typeof value === 'string') {
              if (field.validation?.minLength !== undefined && value.length < field.validation.minLength) {
                errors[field.id] = `${field.label} must be at least ${field.validation.minLength} characters`
              }
              if (field.validation?.maxLength !== undefined && value.length > field.validation.maxLength) {
                errors[field.id] = `${field.label} must be at most ${field.validation.maxLength} characters`
              }
            }
          }
        })
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  useImperativeHandle(ref, () => ({
    validateForm
  }))


  if (!formStructure || !formStructure.sections) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">Form structure is loading or not available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {validationErrors && Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Please fix the following errors:
            <ul className="list-disc pl-5 mt-2">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {Array.isArray(formStructure.sections) ? (
        formStructure.sections.map((section) => {
          if (!shouldDisplay(section.dependsOn)) return null

          return (
            <div key={section.id} className="space-y-4">
              <h3 className="text-lg font-medium">{section.title}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {Array.isArray(section.fields) ? (
                  section.fields.map((field) => {
                    if (!shouldDisplay(field.dependsOn)) return null

                    return (
                      <FormField
                        key={field.id}
                        field={field}
                        value={formValues[field.id]}
                        error={validationErrors[field.id]}
                      />
                    )
                  })
                ) : (
                  <p className="text-muted-foreground">No fields available in this section.</p>
                )}
              </div>
            </div>
          )
        })
      ) : (
        <p className="text-muted-foreground">No sections available in this form.</p>
      )}
    </div>
  )
})

export default DynamicForm

