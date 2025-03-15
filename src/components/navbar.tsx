
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export default function Navbar() {
  const location = useLocation()
  const { setTheme, theme } = useTheme()

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-bold text-xl">
          Smart Insurance
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Home
          </Link>
          <Link
            to="/apply"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/apply" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Apply
          </Link>
          <Link
            to="/applications"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/applications" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Applications
          </Link>
          <Link
            to="/dashboard"
            className={`text-sm font-medium transition-colors ${
              location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground hover:text-primary"
            }`}
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  )
}

