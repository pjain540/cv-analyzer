import React from 'react'
import { RouteType } from '../../routes'

const AllJobDescriptions = React.lazy(() => import('./all'))
const CreateJobDescription = React.lazy(() => import('./create'))
const TrashJobDescriptions = React.lazy(() => import('./trash'))

const jobDescriptionRoutes: RouteType[] = [
  { path: '/job-descriptions', name: 'All Job Descriptions', element: AllJobDescriptions },
  { path: '/job-descriptions/create', name: 'Create Job Description', element: CreateJobDescription },
  { path: '/job-descriptions/trash', name: 'Trash Job Descriptions', element: TrashJobDescriptions },
  { path: '/job-descriptions/edit/:id', name: 'Edit Job Description', element: CreateJobDescription },
]

export default jobDescriptionRoutes
