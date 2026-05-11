import React from 'react'
import { RouteType } from '../../routes'

const AllResumes = React.lazy(() => import('./all'))
const ViewResume = React.lazy(() => import('./view'))
const UploadResume = React.lazy(() => import('./upload'))
const PdfViewer = React.lazy(() => import('./PdfViewer'))

const resumeRoutes: RouteType[] = [
    { path: '/resumes', name: 'All Resumes', element: AllResumes },
    { path: '/resumes/view/:id', name: 'View Resume', element: ViewResume },
    { path: '/resumes/viewer/:id', name: 'Resume Viewer', element: PdfViewer },
    { path: '/upload/resumes', name: 'Upload Resume', element: UploadResume },

]

export default resumeRoutes
