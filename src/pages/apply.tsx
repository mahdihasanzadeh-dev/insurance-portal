import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "@/context/form-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import DynamicForm from "@/components/dynamic-form"
import { useToast } from "@/components/ui/use-toast"
import { SEO } from "@/components/seo"

export default function ApplyPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { fetchFormStructure, formStructure, loadingForm, submitForm, saveDraft, loadDraft } = useForm()
  const [insuranceType, setInsuranceType] = useState("health")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<{ validateForm: () => boolean } | null>(null)

  useEffect(() => {
    fetchFormStructure(insuranceType)
  }, [insuranceType])

  useEffect(() => {
    if (formStructure) {
      try {
        loadDraft()
      } catch (error) {
        console.error("Error loading draft:", error)
        toast({
          title: "Error Loading Draft",
          description: "There was an error loading your saved draft.",
          variant: "destructive",
        })
      }
    }
  }, [formStructure])

  const handleTypeChange = (value: string) => {
    setInsuranceType(value)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const isValid = formRef.current?.validateForm()
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      const success = await submitForm()
      if (success) {
        toast({
          title: "Application Submitted",
          description: "Your insurance application has been submitted successfully.",
        })
        navigate("/applications")
      } else {
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your application. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    saveDraft()
    toast({
      title: "Draft Saved",
      description: "Your application draft has been saved.",
    })
  }

  return (
    <>
      <SEO
        pageTitle="Apply for Insurance | Insurance Portal"
        description="Apply for insurance by filling out the form below. Choose the type of insurance you need and submit your application."
        keywords={["insurance application", "insurance form", "insurance portal", "apply for insurance", "insurance application form"]}
      />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Apply for Insurance</h1>

        <Tabs defaultValue="health" value={insuranceType} onValueChange={handleTypeChange} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="car">Car</TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader>
              <CardTitle>
                {insuranceType.charAt(0).toUpperCase() + insuranceType.slice(1)} Insurance Application
              </CardTitle>
              <CardDescription>Please fill out the form below to apply for insurance</CardDescription>
            </CardHeader>

            <CardContent>
              {loadingForm ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading form...</span>
                </div>
              ) : (
                <DynamicForm ref={formRef} />
              )}
            </CardContent>

            {!loadingForm && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </Tabs>
      </div>
    </>
  )
}

