import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from '@/components/layout/app-shell'

const DashboardPage = lazy(async () => {
  const m = await import('@/pages/dashboard-page')
  return { default: m.DashboardPage }
})
const LedgerPage = lazy(async () => {
  const m = await import('@/pages/ledger-page')
  return { default: m.LedgerPage }
})
const ProjectIntakePage = lazy(async () => {
  const m = await import('@/pages/project-intake-page')
  return { default: m.ProjectIntakePage }
})
const WorkspaceSettingsPage = lazy(async () => {
  const m = await import('@/pages/workspace-settings-page')
  return { default: m.WorkspaceSettingsPage }
})

export function AppRouter(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="ledger" element={<LedgerPage />} />
          <Route path="intake" element={<ProjectIntakePage />} />
          <Route path="settings" element={<WorkspaceSettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
