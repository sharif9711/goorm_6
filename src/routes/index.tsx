import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import LoginPage from '@/pages/Login'
import SignupPage from '@/pages/Signup'
import DashboardPage from '@/pages/Dashboard'
import TodayPage from '@/pages/Today'
import TasksPage from '@/pages/Tasks'
import CalendarPage from '@/pages/Calendar'
import GoalsPage from '@/pages/Goals'
import HabitsPage from '@/pages/Habits'
import DdayPage from '@/pages/Dday'
import SharePage from '@/pages/Share'
import StatsPage from '@/pages/Stats'
import SettingsPage from '@/pages/Settings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/app" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'today', element: <TodayPage /> },
          { path: 'calendar', element: <CalendarPage /> },
          { path: 'tasks', element: <TasksPage /> },
          { path: 'goals', element: <GoalsPage /> },
          { path: 'habits', element: <HabitsPage /> },
          { path: 'dday', element: <DdayPage /> },
          { path: 'share', element: <SharePage /> },
          { path: 'stats', element: <StatsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/app" replace /> },
])
