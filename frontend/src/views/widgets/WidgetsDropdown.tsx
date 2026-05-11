import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CWidgetStatsA, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDescription, cilBriefcase, cilTask } from '@coreui/icons'

interface WidgetsDropdownProps {
  className?: string
  data: {
    totalResumes: number
    totalJobDescriptions: number
    totalResults: number
  }
}

const WidgetsDropdown: React.FC<WidgetsDropdownProps> = ({ className, data }) => {
  const navigate = useNavigate()

  return (
    <CRow className={className} xs={{ gutter: 4 }}>
      {/* Total Resumes Card */}
      <CCol sm={6} xl={4}>
        <CWidgetStatsA
          className="pb-3 shadow-sm border-0 h-100"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/resumes')}
          color="primary"
          value={
            <div className="d-flex align-items-center px-3 pt-2">
              <div className="fs-2 fw-bold">{data.totalResumes}</div>
              <CIcon icon={cilDescription} size="xxl" className="opacity-50 ps-2" />
            </div>
          }
          title={
            <div className="px-3 pb-2">
              <span className="text-white opacity-75 fw-semibold">Resumes</span>
            </div>
          }
        />
      </CCol>

      {/* Job Descriptions Card */}
      <CCol sm={6} xl={4}>
        <CWidgetStatsA
          className="pb-3 shadow-sm border-0 h-100"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/job-descriptions')}
          color="info"
          value={
            <div className="d-flex align-items-center px-3 pt-2">
              <div className="fs-2 fw-bold">{data.totalJobDescriptions}</div>
              <CIcon icon={cilBriefcase} size="xxl" className="opacity-50 ps-2" />
            </div>
          }
          title={
            <div className="px-3 pb-2">
              <span className="text-white opacity-75 fw-semibold">Job Descriptions</span>
            </div>
          }
        />
      </CCol>

      {/* Analysis Results Card */}
      <CCol sm={6} xl={4}>
        <CWidgetStatsA
          className="pb-3 shadow-sm border-0 h-100"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/results')}
          color="warning"
          value={
            <div className="d-flex align-items-center px-3 pt-2">
              <div className="fs-2 fw-bold">{data.totalResults}</div>
              <CIcon icon={cilTask} size="xxl" className="opacity-50 ps-2" />
            </div>
          }
          title={
            <div className="px-3 pb-2">
              <span className="text-white opacity-75 fw-semibold">Analysis Results</span>
            </div>
          }
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
