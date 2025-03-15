import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HomeIcon, FileTextIcon, ListIcon } from "lucide-react"
import { SEO } from "@/components/seo"

export default function HomePage() {
  return (
    <>
      <SEO
        pageTitle="Insurance Portal | Apply for Insurance Online"
        description="Apply for health, home, and car insurance through our easy-to-use online portal. Start your application today and get coverage quickly."
        keywords={["insurance portal", "online insurance application", "health insurance", "home insurance", "car insurance", "insurance coverage"]}
      />
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-8 text-center">Smart Insurance Application Portal</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="h-5 w-5" />
                New Application
              </CardTitle>
              <CardDescription>Start a new insurance application</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Fill out a dynamic form to apply for different types of insurance including Health, Home and Car
                insurance.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/apply" className="w-full">
                <Button className="w-full">Start Application</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListIcon className="h-5 w-5" />
                My Applications
              </CardTitle>
              <CardDescription>View and manage your applications</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Access your submitted applications with a customizable view. Sort, filter, and select which columns to
                display.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/applications" className="w-full">
                <Button className="w-full" variant="outline">
                  View Applications
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5" />
                Dashboard
              </CardTitle>
              <CardDescription>Your insurance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Get a quick overview of your insurance applications status and recent activity.</p>
            </CardContent>
            <CardFooter>
              <Link to="/dashboard" className="w-full">
                <Button className="w-full" variant="outline">
                  Go to Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}

