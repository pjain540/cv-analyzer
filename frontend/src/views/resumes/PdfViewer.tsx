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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft } from '@coreui/icons'
import { resumeService, Resume } from '../../services/resumeService'

const PdfViewer = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [resume, setResume] = useState<Resume | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResume = async () => {
            if (!id) return
            setLoading(true)
            try {
                const data = await resumeService.getResumeById(id)
                setResume(data)
            } catch (error) {
                console.error('Error fetching resume details:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchResume()
    }, [id])

    if (loading) {
        return (
            <div className="text-center p-5">
                <CSpinner color="primary" />
            </div>
        )
    }

    if (!resume) {
        return (
            <div className="text-center p-5">
                <h4>Resume not found</h4>
                <CButton color="primary" onClick={() => navigate('/resumes')}>
                    Go Back
                </CButton>
            </div>
        )
    }

    return (
        <CRow>
            <CCol xs={12}>
                <div className="mb-4 d-flex justify-content-between align-items-center">
                    <CButton color="secondary" variant="outline" onClick={() => navigate(-1)}>
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        Back
                    </CButton>

                </div>

                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Resume Viewer:</strong> {resume.name}
                    </CCardHeader>
                    <CCardBody className="p-0">
                        <div style={{ height: '80vh', width: '100%' }}>
                            <iframe
                                src={resume.resume.url}
                                title={`${resume.name} Resume`}
                                width="100%"
                                height="100%"
                                style={{ border: 'none' }}
                            />
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default PdfViewer
