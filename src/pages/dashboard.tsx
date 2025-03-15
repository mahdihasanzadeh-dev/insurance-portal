import { useEffect } from "react"
import { useForm } from "@/context/form-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileTextIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { SEO } from "@/components/seo"

export default function DashboardPage() {
  const { fetchSubmissions, submissions, loadingSubmissions } = useForm()

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const totalApplications = submissions.length



  const applicationsByType: Record<string, number> = {}
  submissions.forEach((submission) => {
    const type = submission["Insurance Type"]
    if (type) {
      applicationsByType[type] = (applicationsByType[type] || 0) + 1
    }
  })



  return (
    <>
      <SEO
        pageTitle="Dashboard | Insurance Portal"
        description="View your insurance application statistics, recent submissions, and overall portfolio status in one place."
        keywords={["insurance dashboard", "application statistics", "insurance portal", "application tracking", "insurance management"]}
      />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {loadingSubmissions ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading dashboard data...</span>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileTextIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalApplications}</div>
                <p className="text-xs text-muted-foreground">All submitted insurance applications</p>
              </CardContent>
            </Card>

          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Applications by Type</CardTitle>
              <CardDescription>Distribution of applications across insurance types</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(applicationsByType).length === 0 ? (
                <p className="text-muted-foreground">No data available</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(applicationsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{type}</p>
                        <p className="text-sm text-muted-foreground">
                          {((count / totalApplications) * 100).toFixed(1)}% of total
                        </p>
                      </div>
                      <div className="font-bold">{count}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Your most recent insurance applications</CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No applications yet</p>
                  <Link to="/apply" className="text-primary hover:underline block mt-2">
                    Start a new application
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((application) => (
                    <div key={application.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {application["Full Name"] || "Unnamed Application"}
                        </p>
                        <p className="text-sm text-muted-foreground">{application["Insurance Type"]} Insurance</p>
                      </div>
                      <Badge
                        variant={
                          application.Status === "Approved"
                            ? "success"
                            : application.Status === "Pending"
                              ? "warning"
                              : "destructive"
                        }
                      >
                        {application.Status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

