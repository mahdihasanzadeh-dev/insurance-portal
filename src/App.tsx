import { Routes, Route } from "react-router-dom"
import Layout from "./components/layout"
import HomePage from "./pages/home"
import ApplyPage from "./pages/apply"
import ApplicationsPage from "./pages/applications"
import DashboardPage from "./pages/dashboard"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="apply" element={<ApplyPage />} />
          <Route path="applications" element={<ApplicationsPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App

