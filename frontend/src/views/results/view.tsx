import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CSpinner,
    CBadge,
    CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilBriefcase, cilList } from '@coreui/icons'
import analysisService from '../../services/analysisService'
import DataTable, { Column } from '../../components/DataTable'
import { createToast } from '../../utils/toastUtils'

const ViewResult = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [analysis, setAnalysis] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [toast, addToast] = useState<React.ReactElement<any> | undefined>(undefined)

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!id) return
            setLoading(true)
            try {
                const data = await analysisService.getAnalysisById(id)
                setAnalysis(data)
            } catch (error) {
                console.error('Error fetching analysis:', error)
                addToast(createToast('danger', 'Failed to fetch analysis details.'))
            } finally {
                setLoading(false)
            }
        }
        fetchAnalysis()
    }, [id])

    if (loading) {
        return (
            <div className="text-center p-5">
                <CSpinner color="primary" />
            </div>
        )
    }

    if (!analysis) {
        return (
            <div className="text-center p-5">
                <h4>Analysis not found</h4>
                <CButton color="primary" onClick={() => navigate('/results')}>
                    Go Back
                </CButton>
            </div>
        )
    }

    const columns: Column<any>[] = [
        {
            header: 'Candidate Name',
            field: 'resumeId.name',
            render: (item) => item.resumeId?.name || 'N/A',
        },
        {
            header: 'AI Remark',
            field: 'aiRemark',
            render: (item) => (
                <div style={{ maxWidth: '400px', whiteSpace: 'normal' }}>
                    {item.aiRemark}
                </div>
            ),
        },
        {
            header: 'Match %',
            field: 'matchPercentage',
            render: (item) => (
                <div className="d-flex align-items-center gap-2">
                    <div className="flex-grow-1" style={{ width: '100px' }}>
                        <div className="progress" style={{ height: '8px' }}>
                            <div
                                className={`progress-bar bg-${item.matchPercentage >= 70 ? 'success' : item.matchPercentage >= 40 ? 'warning' : 'danger'}`}
                                role="progressbar"
                                style={{ width: `${item.matchPercentage}%` }}
                                aria-valuenow={item.matchPercentage}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            ></div>
                        </div>
                    </div>
                    <CBadge color={item.matchPercentage >= 70 ? 'success' : item.matchPercentage >= 40 ? 'warning' : 'danger'}>
                        {item.matchPercentage}%
                    </CBadge>
                </div>
            ),
        },
        // {
        //     header: 'Score',
        //     field: 'score',
        //     render: (item) => <strong>{item.score}</strong>,
        // }
    ]

    return (
        <CRow>
            <CToaster push={toast} placement="top-end" />
            <CCol xs={12}>
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <CButton color="secondary" variant="outline" onClick={() => navigate('/results')}>
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        Back to All Results
                    </CButton>
                </div>

                {/* Job Description Summary */}
                <CCard className="mb-4 border-top-primary border-top-3">
                    <CCardHeader className="">
                        <div className="d-flex align-items-center">
                            <CIcon icon={cilBriefcase} className="me-2 text-primary" />
                            <h5 className="mb-0">Job Description Details</h5>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol md={8}>
                                <h4 className="text-primary mb-1">{analysis.jobDescription?.title}</h4>
                                <div className="text-muted">
                                    <strong>Required Experience:</strong> {analysis.jobDescription?.experience}
                                    <p className="text-secondary mb-0">{analysis.jobDescription?.description}</p>
                                </div>

                            </CCol>
                            <CCol md={4} className="text-md-end">
                                <div className="p-3">
                                    {/* <div className="text-muted small mb-1">Analysis Date</div>
                                    <div className="fw-bold">{new Date(analysis.createdAt).toLocaleDateString()}</div> */}
                                    <div className="text-muted small mt-2">Candidates Analyzed</div>
                                    <div className="h4 mb-0 text-primary">{analysis.resumes?.length || 0}</div>
                                </div>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>

                {/* Resumes Comparison Table */}
                <CCard className="mb-4 shadow-sm">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <CIcon icon={cilList} className="me-2" />
                            <strong>Ranked Candidates</strong>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <DataTable
                            data={analysis.resumes || []}
                            columns={columns}
                            loading={false}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default ViewResult
