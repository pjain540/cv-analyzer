import React from 'react'
import { RouteType } from '../../routes'

const AllResults = React.lazy(() => import('./all'))
const ViewResult = React.lazy(() => import('./view'))

const resultRoutes: RouteType[] = [
    { path: '/results', name: 'All Results', element: AllResults },
    { path: '/results/view/:id', name: 'View Result', element: ViewResult },
]

export default resultRoutes
