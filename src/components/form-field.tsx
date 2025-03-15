import { useForm } from "@/context/form-context"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type FormFieldProps = {
  field: {
    id: string
    type: string
    label: string
    required?: boolean
    options?: { label: string; value: string }[]
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
  value: any
  error?: string
}


export function FormField({ field, value, error }: FormFieldProps) {
  const { updateFormValue } = useForm()

  const handleChange = (newValue: any) => {
    updateFormValue(field.id, newValue)
  }

  const renderField = () => {
    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <Input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            min={field.validation?.min}
            max={field.validation?.max}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
            pattern={field.validation?.pattern}
            className={error ? "border-destructive" : ""}
          />
        )

      case "textarea":
        return (
          <Textarea
            id={field.id}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            className={error ? "border-destructive" : ""}
          />
        )

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  error && "border-destructive",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => handleChange(date ? date.toISOString().split("T")[0] : "")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )

      case "select":
        return (
          <Select value={value || ""} onValueChange={handleChange}>
            <SelectTrigger className={error ? "border-destructive" : ""}>
              <SelectValue placeholder={field.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {field.options && field.options.length > 0 ? (
                field.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-options" disabled>
                  {field.dynamicOptions 
                    ? `Please select ${field.dynamicOptions.dependsOn} first` 
                    : "No options available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox id={field.id} checked={value || false} onCheckedChange={handleChange} />
          </div>
        )

      case "radio":
        const radioOptions = field.options || []
        return (
          <RadioGroup value={value || ""} onValueChange={handleChange}>
            <div className="space-y-2">
              {radioOptions.map((option) => {
                const optionValue = typeof option === "string" ? option : option.value
                const optionLabel = typeof option === "string" ? option : option.label

                return (
                  <div key={optionValue} className="flex items-center space-x-2">
                    <RadioGroupItem value={optionValue} id={`${field.id}-${optionValue}`} />
                    <Label htmlFor={`${field.id}-${optionValue}`}>{optionLabel}</Label>
                  </div>
                )
              })}
            </div>
          </RadioGroup>
        )

      case "switch":
        return (
          <div className="flex items-center space-x-2">
            <Switch id={field.id} checked={value || false} onCheckedChange={handleChange} />
          </div>
        )

      default:
        return (
          <Input
            id={field.id}
            type="text"
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            required={field.required}
            className={error ? "border-destructive" : ""}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label htmlFor={field.id} className="text-sm font-medium">
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      </div>

      {renderField()}

      {field.description && <p className="text-sm text-muted-foreground">{field.description}</p>}

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  )
}

