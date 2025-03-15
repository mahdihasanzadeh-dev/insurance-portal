import { useEffect, useState } from "react"
import { useForm } from "@/context/form-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp, Filter, Loader2, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SEO } from "@/components/seo"

export default function ApplicationsPage() {
  const { fetchSubmissions, submissions, loadingSubmissions } = useForm()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({})
  const [allColumns, setAllColumns] = useState<string[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchSubmissions()
  }, [])

  useEffect(() => {
    if (submissions.length > 0) {
      try {
        const columns = Object.keys(submissions[0]).filter((col) => col !== "id")
        setAllColumns(columns)

        const initialVisibleColumns: Record<string, boolean> = {}
        columns.forEach((col) => {
          initialVisibleColumns[col] = true
        })
        setVisibleColumns(initialVisibleColumns)
      } catch (error) {
        console.error("Error processing submissions:", error)
        setAllColumns([])
        setVisibleColumns({})
      }
    }
  }, [submissions])

  useEffect(() => {
    try {
      const filtered = submissions.filter((submission) => {
        if (!submission) return false

        return Object.entries(submission).some(([key, value]) => {
          if (key === "id" || value === undefined || value === null) return false
          return String(value).toLowerCase().includes(searchTerm.toLowerCase())
        })
      })

      if (sortColumn) {
        filtered.sort((a, b) => {
          if (!a || !b) return 0

          const aValue = a[sortColumn]
          const bValue = b[sortColumn]

          if (aValue === undefined || bValue === undefined) return 0

          if (typeof aValue === "number" && typeof bValue === "number") {
            return sortDirection === "asc" ? aValue - bValue : bValue - aValue
          }

          const aString = String(aValue || "").toLowerCase()
          const bString = String(bValue || "").toLowerCase()

          if (sortDirection === "asc") {
            return aString.localeCompare(bString)
          } else {
            return bString.localeCompare(aString)
          }
        })
      }

      setFilteredSubmissions(filtered)
    } catch (error) {
      console.error("Error filtering or sorting submissions:", error)
      setFilteredSubmissions([])
    }
  }, [submissions, searchTerm, sortColumn, sortDirection])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const toggleColumnVisibility = (column: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }))
  }

  const visibleColumnsArray = allColumns.filter((col) => visibleColumns[col])


  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
  const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <SEO
        pageTitle="My Applications | Insurance Portal"
        description="View and manage your submitted insurance applications. Track the status of your applications and access your insurance information."
        keywords={["insurance applications", "application status", "insurance portal", "my applications", "insurance management"]}
      />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">My Applications</h1>

        <Card>
          <CardHeader>
            <CardTitle>Applications List</CardTitle>
            <CardDescription>View and manage your submitted insurance applications</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                      <Filter className="h-4 w-4" />
                      Columns
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {allColumns.map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column}
                        checked={visibleColumns[column]}
                        onCheckedChange={() => toggleColumnVisibility(column)}
                      >
                        {column}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {loadingSubmissions ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading applications...</span>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {visibleColumnsArray.map((column) => (
                          <TableHead key={column} className="cursor-pointer" onClick={() => handleSort(column)}>
                            <div className="flex items-center gap-1">
                              {column}
                              {sortColumn === column &&
                                (sortDirection === "asc" ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                ))}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedSubmissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={visibleColumnsArray.length} className="h-24 text-center">
                            No applications found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedSubmissions.map((submission) => (
                          <TableRow key={submission.id}>
                            {visibleColumnsArray.map((column) => (
                              <TableCell key={`${submission.id}-${column}`}>
                                {column === "Status" ? (
                                  <Badge
                                    variant={
                                      submission[column] === "Approved"
                                        ? "success"
                                        : submission[column] === "Pending"
                                          ? "warning"
                                          : "destructive"
                                    }
                                  >
                                    {submission[column]}
                                  </Badge>
                                ) : (
                                  submission[column]
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

