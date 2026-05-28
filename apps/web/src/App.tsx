import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicShell } from '@/components/layout/Shell'
import { AdminShell } from '@/components/layout/Shell'
import { PerformerShell } from '@/components/layout/Shell'
import { AuthGuard, AdminGuard } from '@/lib/AuthGuard'
import { HomePage } from '@/pages/HomePage'
import { RosterPage } from '@/pages/RosterPage'
import { PerformerPage } from '@/pages/PerformerPage'
import { AboutPage } from '@/pages/AboutPage'
import { ContactPage } from '@/pages/ContactPage'
import { LoginPage } from '@/pages/LoginPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminPerformers } from '@/pages/admin/AdminPerformers'
import { AdminPerformerNew } from '@/pages/admin/AdminPerformerNew'
import { AdminPerformerEdit } from '@/pages/admin/AdminPerformerEdit'
import { AdminInquiries } from '@/pages/admin/AdminInquiries'
import { PerformerDashboard } from '@/pages/performer/PerformerDashboard'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Public */}
        <Route element={<PublicShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/roster" element={<RosterPage />} />
          <Route path="/performers/:performerId" element={<PerformerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* Performer portal */}
        <Route element={<AuthGuard />}>
          <Route element={<PerformerShell />}>
            <Route path="/dashboard" element={<PerformerDashboard />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<AdminGuard />}>
          <Route element={<AdminShell />}>
            <Route path="/admin" element={<Navigate to="/admin/performers" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/performers" element={<AdminPerformers />} />
            <Route path="/admin/performers/new" element={<AdminPerformerNew />} />
            <Route path="/admin/performers/:performerId" element={<AdminPerformerEdit />} />
            <Route path="/admin/inquiries" element={<AdminInquiries />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
