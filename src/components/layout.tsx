import { Outlet } from "react-router-dom"
import Navbar from "@/components/navbar"

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Smart Insurance Portal
        </div>
      </footer>
    </div>
  )
}

