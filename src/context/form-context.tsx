import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ApiFormField, ApiFormStructure, FormContextType, FormField, FormSection, FormStructure, FormValues } from "./form-context-type"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL




const FormContext = createContext<FormContextType | undefined>(undefined)

const fetchDynamicOptions = async (endpoint: string, method: string, params?: Record<string, any>) => {
  try {

    const queryString = params ? '?' + Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&') : ''

    const url = `${API_BASE_URL}${endpoint}${queryString}`

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) throw new Error('Failed to fetch dynamic options')
    const data = await response.json()
    
    // Handle both array and object responses
    if (Array.isArray(data)) {
      return data.map((option: string) => ({ label: option, value: option }))
    } else if (typeof data === 'object') {
      // Find the first key in the response that contains an array
      const optionsKey = Object.keys(data).find(key => Array.isArray(data[key as keyof typeof data]))
      if (optionsKey) {
        const optionsArray = data[optionsKey]
        return optionsArray.map((item: string) => ({ label: item, value: item }))
      }
    }
    
    return []
  } catch (error) {
    console.error('Error fetching dynamic options:', error)
    return []
  }
}

export function FormProvider({ children }: { children: ReactNode }) {
  const [formStructure, setFormStructure] = useState<FormStructure | null>(null)
  const [formValues, setFormValues] = useState<FormValues>({})
  const [loadingForm, setLoadingForm] = useState(false)
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([])


  const transformFormStructure = (apiForm: ApiFormStructure, type: string): FormStructure => {
    

    const sections: FormSection[] = []


    apiForm.fields.forEach((field) => {
      if (field.type === "group") {
        const transformedFields = transformFields(field.fields || [])
        
        sections.push({
          id: field.id,
          title: field.label,
          fields: transformedFields,
        })
      } else {

        let generalSection = sections.find((s) => s.id === "general")
        if (!generalSection) {
          generalSection = {
            id: "general",
            title: "General Information",
            fields: [],
          }
          sections.push(generalSection)
        }

        // Add the field to the General section
        const transformedField = transformField(field)
        generalSection.fields.push(transformedField)
      }
    })

    const transformedStructure = {
      id: apiForm.formId,
      title: apiForm.title,
      type: type,
      sections: sections,
    }
    
    return transformedStructure
  }


  const transformFields = (apiFields: ApiFormField[]): FormField[] => {
    return apiFields.map((field) => transformField(field))
  }


  const transformField = (apiField: ApiFormField): FormField => {
    // Transform options from string[] to {label, value}[]
    let options: { label: string; value: string }[] | undefined

    if (apiField.options) {
      if (Array.isArray(apiField.options) && typeof apiField.options[0] === "string") {
        // Convert string[] to {label, value}[]
        options = (apiField.options as string[]).map((opt) => ({
          label: opt,
          value: opt,
        }))
      } else {
        // Already in {label, value}[] format
        options = apiField.options as { label: string; value: string }[]
      }
    }

    // Transform visibility to dependsOn
    let dependsOn: { field: string; value: any } | undefined
    if (apiField.visibility) {
      dependsOn = {
        field: apiField.visibility.dependsOn,
        value: apiField.visibility.value,
      }
    }

    return {
      id: apiField.id,
      type: apiField.type,
      label: apiField.label,
      required: apiField.required,
      options: options,
      dependsOn: dependsOn,
      validation: apiField.validation,
      dynamicOptions: apiField.dynamicOptions,
      placeholder: apiField.placeholder,
      description: apiField.description,
    }
  }


  const createDefaultFormStructure = (type: string): FormStructure => {
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1)


      return {
        id: `${type}_insurance_application`,
        title: `${capitalizedType} Insurance Application`,
        type: type,
        sections: [
          {
            id: "personal_info",
            title: "Personal Information",
            fields: [
              {
                id: "first_name",
                type: "text",
                label: "First Name",
                required: true,
              },
              {
                id: "last_name",
                type: "text",
                label: "Last Name",
                required: true,
              },
              {
                id: "email",
                type: "email",
                label: "Email Address",
                required: true,
              },
              {
                id: "phone",
                type: "tel",
                label: "Phone Number",
                required: true,
              },
            ],
          },
        ],
      }
  }

  const fetchFormStructure = async (type: string) => {
    setLoadingForm(true)
    try {

      const response = await fetch(`${API_BASE_URL}/api/insurance/forms`)
      if (!response.ok) throw new Error("Failed to fetch form structure")

      const data = await response.json()

      if (Array.isArray(data)) {
        const formTypeMap: Record<string, string> = {
          health: "health_insurance_application",
          home: "home_insurance_application",
          car: "car_insurance_application",
        }

        const formId = formTypeMap[type]
        const matchingForm = data.find((form) => form.formId === formId)

        if (matchingForm) {
          const transformedForm = transformFormStructure(matchingForm, type)
          setFormStructure(transformedForm)

          const initialValues: FormValues = {}
          transformedForm.sections.forEach((section) => {
            section.fields.forEach((field) => {
              initialValues[field.id] = ""
            })
          })
          setFormValues(initialValues)
        } else {
          const defaultForm = createDefaultFormStructure(type)
          setFormStructure(defaultForm)


          const initialValues: FormValues = {}
          defaultForm.sections.forEach((section) => {
            section.fields.forEach((field) => {
              initialValues[field.id] = ""
            })
          })
          setFormValues(initialValues)
        }
      } else {
        console.error("Invalid API response format:", data)
        const defaultForm = createDefaultFormStructure(type)
        setFormStructure(defaultForm)

        const initialValues: FormValues = {}
        defaultForm.sections.forEach((section) => {
          section.fields.forEach((field) => {
            initialValues[field.id] = ""
          })
        })
        setFormValues(initialValues)
      }
    } catch (error) {
      console.error("Error fetching form structure:", error)

      const defaultForm = createDefaultFormStructure(type)
      setFormStructure(defaultForm)

      const initialValues: FormValues = {}
      defaultForm.sections.forEach((section) => {
        section.fields.forEach((field) => {
          initialValues[field.id] = ""
        })
      })
      setFormValues(initialValues)
    } finally {
      setLoadingForm(false)
    }
  }

  const updateFormValue = async (fieldId: string, value: any) => {

    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))

    // Handle dynamic options
    if (formStructure) {
      const findDependentFields = (sections: FormSection[]): FormField[] => {
        const dependentFields: FormField[] = []
        sections.forEach(section => {
          section.fields.forEach(field => {
            if (field.dynamicOptions?.dependsOn === fieldId) {
              dependentFields.push(field)
            }
          })
        })
        return dependentFields
      }

      const dependentFields = findDependentFields(formStructure.sections)
      
      // Update each dependent field's options
      for (const dependentField of dependentFields) {
        if (dependentField.dynamicOptions) {
          const options = await fetchDynamicOptions(
            dependentField.dynamicOptions.endpoint,
            dependentField.dynamicOptions.method,
            { [dependentField.dynamicOptions.dependsOn]: value }
          )
          
          
          // Update the field's options in the form structure
          setFormStructure(prev => {
            if (!prev) return null
            return {
              ...prev,
              sections: prev.sections.map(section => ({
                ...section,
                fields: section.fields.map(field => 
                  field.id === dependentField.id
                    ? { ...field, options }
                    : field
                )
              }))
            }
          })

          // Clear the dependent field's value since options have changed
          setFormValues(prev => ({
            ...prev,
            [dependentField.id]: ""
          }))
        }
      }
    }
  }

  const submitForm = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/insurance/forms/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formId: formStructure?.id,
          formType: formStructure?.type,
          values: formValues,
        }),
      })

      if (!response.ok) throw new Error("Failed to submit form")

      // Clear draft after successful submission
      localStorage.removeItem("formDraft")
      return true
    } catch (error) {
      console.error("Error submitting form:", error)
      return false
    }
  }

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/insurance/forms/submissions`)
      if (!response.ok) throw new Error("Failed to fetch submissions")
      const data = await response.json()
      setSubmissions(data.data || [])
    } catch (error) {
      console.error("Error fetching submissions:", error)
    } finally {
      setLoadingSubmissions(false)
    }
  }

  const saveDraft = () => {
    if (formStructure) {
      localStorage.setItem(
        "formDraft",
        JSON.stringify({
          formId: formStructure.id,
          formType: formStructure.type,
          values: formValues,
        }),
      )
    }
  }

  const loadDraft = () => {
    const draft = localStorage.getItem("formDraft")
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft)
        if (parsedDraft.formId === formStructure?.id) {
          setFormValues(parsedDraft.values)
        }
      } catch (error) {
        console.error("Error loading draft:", error)
      }
    }
  }

  useEffect(() => {
    if (!formStructure) return

    const interval = setInterval(() => {
      saveDraft()
    }, 30000)

    return () => clearInterval(interval)
  }, [formStructure, formValues])

  return (
    <FormContext.Provider
      value={{
        formStructure,
        formValues,
        loadingForm,
        loadingSubmissions,
        submissions,
        fetchFormStructure,
        updateFormValue,
        submitForm,
        fetchSubmissions,
        saveDraft,
        loadDraft,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider")
  }
  return context
}

