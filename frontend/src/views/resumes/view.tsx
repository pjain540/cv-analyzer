import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CBadge,
    CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilArrowLeft,
    cilEnvelopeClosed,
    cilPhone,
    cilEducation,
    cilBriefcase,
    cilExternalLink,
    cilGlobeAlt,
} from '@coreui/icons'
import { resumeService, Resume } from '../../services/resumeService'

const ViewResume = () => {
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
                    <CButton color="secondary" variant="outline" onClick={() => navigate('/resumes')}>
                        <CIcon icon={cilArrowLeft} className="me-2" />
                        Back to List
                    </CButton>
                    <CButton
                        color="primary"
                        onClick={() => navigate(`/resumes/viewer/${id}`)}
                    >
                        <CIcon icon={cilExternalLink} className="me-2" />
                        View Original Resume
                    </CButton>
                </div>

                <CRow>
                    {/* Main Info */}
                    <CCol md={8}>
                        <CCard className="mb-4 border-top-primary border-top-3">
                            <CCardBody>
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <div>
                                        <h2 className="mb-1">{resume.name}</h2>
                                        <div className="text-muted d-flex gap-3">
                                            {resume.email && (
                                                <span>
                                                    <CIcon icon={cilEnvelopeClosed} className="me-1" /> {resume.email}
                                                </span>
                                            )}
                                            {resume.phone && (
                                                <span>
                                                    <CIcon icon={cilPhone} className="me-1" /> {resume.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h5 className="border-bottom pb-2 mb-3">
                                        <CIcon icon={cilBriefcase} className="me-2" /> AI Summary
                                    </h5>
                                    <p className="lead">{resume.aiSummary}</p>
                                </div>

                                <div className="mb-4">
                                    <h5 className="border-bottom pb-2 mb-3">
                                        <CIcon icon={cilEducation} className="me-2" /> Education
                                    </h5>
                                    <p>{resume.education}</p>
                                </div>

                                <div className="mb-4">
                                    <h5 className="border-bottom pb-2 mb-3">
                                        <CIcon icon={cilBriefcase} className="me-2" /> Experience
                                    </h5>
                                    <p>{resume.experience}</p>
                                </div>
                            </CCardBody>
                        </CCard>
                    </CCol>

                    {/* Sidebar Info */}
                    <CCol md={4}>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <strong>Skills & Expertise</strong>
                            </CCardHeader>
                            <CCardBody>
                                <div className="d-flex flex-wrap gap-2">
                                    {resume.skills.map((skill, index) => (
                                        <CBadge key={index} color="info" shape="rounded-pill" className="p-2">
                                            {skill}
                                        </CBadge>
                                    ))}
                                </div>
                            </CCardBody>
                        </CCard>

                        {(resume.linkedInUrl || resume.gitHubUrl || resume.portfolioUrl) && (
                            <CCard className="mb-4">
                                <CCardHeader>
                                    <strong>Professional Links</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <div className="d-grid gap-2">
                                        {resume.linkedInUrl && (
                                            <CButton
                                                color="primary"
                                                variant="outline"
                                                href={resume.linkedInUrl}
                                                target="_blank"
                                            >
                                                LinkedIn Profile
                                            </CButton>
                                        )}
                                        {resume.gitHubUrl && (
                                            <CButton
                                                color="dark"
                                                variant="outline"
                                                href={resume.gitHubUrl}
                                                target="_blank"
                                            >
                                                GitHub Repository
                                            </CButton>
                                        )}
                                        {resume.portfolioUrl && (
                                            <CButton
                                                color="success"
                                                variant="outline"
                                                href={resume.portfolioUrl}
                                                target="_blank"
                                            >
                                                <CIcon icon={cilGlobeAlt} className="me-2" /> Portfolio
                                            </CButton>
                                        )}
                                    </div>
                                </CCardBody>
                            </CCard>
                        )}
                    </CCol>
                </CRow>
            </CCol>
        </CRow>
    )
}

export default ViewResume