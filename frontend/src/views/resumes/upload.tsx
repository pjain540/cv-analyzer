import React, { useState, useEffect, useRef } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CFormInput,
    CFormCheck,
    CSpinner,
    CBadge,
    CToaster,
} from '@coreui/react'
import { createToast } from '../../utils/toastUtils'
import CIcon from '@coreui/icons-react'
import { cilCloudUpload } from '@coreui/icons'
import DataTable, { Column } from '../../components/DataTable'
import { jobService, JobDescription } from '../../services/jobService'
import { resumeService } from '../../services/resumeService'
import { useNavigate, useSearchParams } from 'react-router-dom'
import analysisService from '../../services/analysisService'

const UploadResume = () => {
    const [jds, setJds] = useState<JobDescription[]>([])
    const [selectedJDs, setSelectedJDs] = useState<string[]>([])
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
    const [uploading, setUploading] = useState(false)
    const [analyzing, setAnalyzing] = useState(false)
    const [results, setResults] = useState<any[]>([])
    const [toast, addToast] = useState<React.ReactElement<any> | undefined>(undefined)
    const toaster = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const id = searchParams.get('id')

    useEffect(() => {
        fetchJDs()
    }, [])

    useEffect(() => {
        if (id && jds.length > 0) {
            const match = jds.find((jd) => jd._id === id)
            if (match) {
                setSelectedJDs([id])
            }
        }
    }, [jds, id])

    const fetchJDs = async () => {
        try {
            const result = await jobService.getAllJobDescriptions(undefined, undefined, false)
            setJds(result.data || [])
        } catch (error) {
            console.error('Error fetching JDs:', error)
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        if (files.length > 10) {
            addToast(createToast('danger', 'You can only upload a maximum of 10 files at a time.'))
            e.target.value = ''
            return
        }

        setSelectedFiles(files)
        setUploading(true)

        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append('resume', files[i])
        }


        try {
            const response = await resumeService.uploadResumes(formData)
            setResults((prevResults) => [...prevResults, ...response])
        } catch (error) {
            console.error('Error uploading resumes:', error)
        } finally {
            setUploading(false)
        }
    }

    const handleJDChange = (id: string) => {
        setSelectedJDs([id])
    }

    const handleStartAnalysis = async () => {
        if (results.length === 0) {
            addToast(createToast('danger', 'Please upload at least one resume first.'))
            return
        }

        if (selectedJDs.length === 0) {
            addToast(createToast('danger', 'Please select a Job Description.'))
            return
        }

        setAnalyzing(true)
        try {
            // Get unique resume IDs from results
            const resumeIds = Array.from(new Set(results.map((res) => res.result?._id))).filter(Boolean)
            const payload = {
                resume: resumeIds,
                jobDescription: selectedJDs[0]
            }

            const data = await analysisService.createAnalysis(payload)
            addToast(createToast('success', 'Analysis completed successfully!'))

            navigate(`/results/view/${data._id}`)
        } catch (error: any) {
            console.error('Error during analysis:', error)
            const errorMsg = error.response?.data?.message || 'Failed to perform analysis. Please try again.'
            addToast(createToast('danger', errorMsg))
        } finally {
            setAnalyzing(false)
        }
    }

    const columns: Column<any>[] = [
        {
            header: 'Name',
            field: 'result.name',
            render: (item) => item.result?.name || 'N/A',
        },
        {
            header: 'Role',
            field: 'result.role',
            render: (item) => item.result?.role || 'N/A',
        },
        {
            header: 'Experience',
            field: 'result.experience',
            render: (item) => item.result?.experience || 'N/A',
        },
        {
            header: 'Status',
            field: 'status',
            render: (item) => (
                <CBadge color={item.result?.status === 'error' ? 'danger' : 'success'}>
                    {item.result?.status === 'error' ? 'Error' : 'Processed'}
                </CBadge>
            ),
        },
    ]

    return (
        <CRow>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            {/* Upload Part and Results */}
            <CCol md={9}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Upload Resumes</strong>
                    </CCardHeader>
                    <CCardBody>
                        <div
                            className="mb-3 py-5 border-2 rounded text-center position-relative"
                            style={{
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                border: '2px dashed #dcdcdc',
                                background: "#dcdcdc1a",
                                minHeight: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {uploading ? (
                                <>
                                    <CSpinner color="primary" className="mb-3" />
                                    <h5 className="mb-1 fw-bold text-primary">Processing Resumes...</h5>
                                    <div className="text-muted small">
                                        Please wait while we analyze your documents
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        className="d-inline-flex align-items-center justify-content-center border border-dashed rounded p-2 mb-3 bg-white shadow-sm"
                                        style={{ width: '48px', height: '48px' }}
                                    >
                                        <CIcon icon={cilCloudUpload} size="lg" className="text-black border-dashed" />
                                    </div>
                                    <h5 className="mb-1 fw-bold text-muted">Drop CVs here or click to browse</h5>
                                    <div className="text-muted small">
                                        PDF — up to 5 MB each — max 10 files
                                    </div>
                                    <CFormInput
                                        type="file"
                                        id="resumeUpload"
                                        multiple
                                        accept=".pdf,.doc,.docx,.txt"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                        className="position-absolute opacity-0 w-100 h-100 top-0 start-0"
                                        style={{ cursor: 'pointer' }}
                                    />
                                </>
                            )}
                        </div>

                        {selectedFiles && (
                            <div className="mt-3">
                                <h6>Files to process ({selectedFiles.length}):</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {Array.from(selectedFiles).map((file, idx) => (
                                        <CBadge key={idx} color="secondary" shape="rounded-pill">
                                            {file.name}
                                        </CBadge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CCardBody>
                </CCard>

                {/* List of Response */}
                {(results.length > 0) && (
                    <CCard className="mb-4 animate__animated animate__fadeIn">
                        <CCardHeader>
                            <strong>Analysis Results</strong>
                        </CCardHeader>
                        <CCardBody>
                            <DataTable
                                data={results}
                                columns={columns}
                                loading={false}
                            />
                        </CCardBody>
                    </CCard>
                )}
            </CCol>

            {/* JD Selection */}
            <CCol md={3}>
                <CCard className="mb-4 sticky-top" style={{ top: '90px', zIndex: 10 }}>
                    <CCardHeader>
                        <strong>Select JD</strong>
                    </CCardHeader>
                    <CCardBody>
                        <div className="mb-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {jds.length > 0 ? (
                                jds.map((jd) => (
                                    <CFormCheck
                                        type="radio"
                                        name="jd-selection"
                                        key={jd._id}
                                        id={jd._id}
                                        label={<span>{jd.title}</span>}
                                        checked={selectedJDs.includes(jd._id!)}
                                        onChange={() => handleJDChange(jd._id!)}
                                        className="mb-2"
                                    />
                                ))
                            ) : (
                                <div className="text-center py-3">
                                    <div className="small text-muted mb-2">No JDs found, Add Job Description for performing analysis.</div>
                                    <CButton size="sm" color="primary" onClick={() => navigate('/job-descriptions/create')}>
                                        Create JD
                                    </CButton>
                                </div>
                            )}
                        </div>
                        <div className="d-grid gap-2 border-top pt-3">
                            <CButton
                                color="primary"
                                disabled={uploading || analyzing || results.length === 0 || selectedJDs.length === 0}
                                onClick={handleStartAnalysis}
                                className="d-flex align-items-center justify-content-center"
                            >
                                {analyzing ? (
                                    <>
                                        <CSpinner size="sm" className="me-2" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <CIcon icon={cilCloudUpload} className="me-2" />
                                        Start Analysis
                                    </>
                                )}
                            </CButton>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default UploadResume