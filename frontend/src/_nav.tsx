/**
 * Sidebar Navigation Configuration
 *
 * Defines the structure and content of the sidebar navigation menu.
 * Supports multiple navigation component types from CoreUI React:
 * - CNavItem: Single navigation link
 * - CNavGroup: Collapsible group of links
 * - CNavTitle: Section title/divider
 *
 * @module _nav
 */

import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDescription,
  cilSearch,
  cilSpeedometer,
  cilUser,
  cilUserPlus,
} from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

interface NavItem {
  component: React.ComponentType<any>
  name: string
  to?: string
  href?: string
  icon?: React.ReactNode
  badge?: {
    color: string
    text: string
  }
  items?: NavItem[]
}

const _nav: NavItem[] = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,

  },

  {
    component: CNavItem,
    name: 'All Resumes',
    to: '/resumes',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,

  },

  {
    component: CNavItem,
    name: 'Upload Resumes',
    to: '/upload/resumes',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,

  },

  {
    component: CNavGroup,
    name: 'Job Description',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Job Descriptions',
        to: '/job-descriptions',
        // icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Create Job Description',
        to: '/job-descriptions/create',
        // icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      // {
      //   component: CNavItem,
      //   name: 'Trash Job Descriptions',
      //   to: '/job-descriptions/trash',
      //   // icon: <CIcon icon={cilTrash} customClassName="nav-icon" />,
      // },
    ],
  },

  {
    component: CNavItem,
    name: 'All Results',
    to: '/results',
    icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,

  },

]

export default _nav
