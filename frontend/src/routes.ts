/**
 * Application Routes Configuration
 *
 * Defines all protected routes in the application using React lazy loading
 * for code splitting and performance optimization.
 *
 * Each route object contains:
 * - path: URL path for the route
 * - name: Human-readable name for breadcrumbs
 * - element: Lazy-loaded React component
 * - exact: (optional) Requires exact path match
 *
 * @module routes
 */

import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Job Descriptions
import jobDescriptionRoutes from './views/jobDescription/route'
import resumeRoutes from './views/resumes/route'
import resultRoutes from './views/results/route'

export interface RouteType {
  path: string
  name: string
  element?: React.LazyExoticComponent<any>
  exact?: boolean
}

/**
 * Array of route configuration objects
 */
export const routes: RouteType[] = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  ...jobDescriptionRoutes,
  ...resumeRoutes,
  ...resultRoutes,
]

export default routes
