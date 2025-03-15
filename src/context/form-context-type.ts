export type ApiFormField = {
    id: string
    label: string
    type: string
    required?: boolean
    options?: string[] | { label: string; value: string }[]
    visibility?: {
      dependsOn: string
      condition: string
      value: string | boolean | number
    }
    validation?: {
      pattern?: string
      min?: number
      max?: number
      minLength?: number
      maxLength?: number
    }
    dynamicOptions?: {
      dependsOn: string
      endpoint: string
      method: string
    }
    fields?: ApiFormField[] 
    placeholder?: string
    description?: string
  }
  
export type ApiFormStructure = {
    formId: string
    title: string
    fields: ApiFormField[]
  }
  
  
export  type FormField = {
    id: string
    type: string
    label: string
    required?: boolean
    options?: { label: string; value: string }[]
    dependsOn?: {
      field: string
      value: string | boolean | number
    }
    placeholder?: string
    validation?: {
      pattern?: string
      min?: number
      max?: number
      minLength?: number
      maxLength?: number
    }
    description?: string
    dynamicOptions?: {
      dependsOn: string
      endpoint: string
      method: string
    }
  }
  
export  type FormSection = {
    id: string
    title: string
    fields: FormField[]
    dependsOn?: {
      field: string
      value: string | boolean | number
    }
  }
  
export  type FormStructure = {
    id: string
    title: string
    type: string
    sections: FormSection[]
  }
  
export  type FormValues = Record<string, any>
  
 export type FormContextType = {
    formStructure: FormStructure | null
    formValues: FormValues
    loadingForm: boolean
    loadingSubmissions: boolean
    submissions: any[]
    fetchFormStructure: (type: string) => Promise<void>
    updateFormValue: (fieldId: string, value: any) => void
    submitForm: () => Promise<boolean>
    fetchSubmissions: () => Promise<void>
    saveDraft: () => void
    loadDraft: () => void
  }