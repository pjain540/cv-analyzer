import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CFormTextarea,
    CRow,
    CToaster,
} from '@coreui/react'
import { createToast } from '../../utils/toastUtils'
import { jobService, JobDescription } from '../../services/jobService'

const CreateJobDescriptions = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const isEditMode = Boolean(id)

    const [formData, setFormData] = useState({
        title: '',
        experience: '',
        skills: '',
        description: '',
    })

    const [loading, setLoading] = useState(false)
    const [toast, addToast] = useState<React.ReactElement<any> | undefined>(undefined)
    const toaster = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (id) {
            const fetchJobDetails = async () => {
                setLoading(true)
                try {
                    const data = await jobService.getJobDescriptionById(id)
                    setFormData({
                        title: data.title,
                        experience: data.experience,
                        skills: data.skills.join(', '), // Convert array to string
                        description: data.description,
                    })
                } catch (error) {
                    console.error('Error fetching job details:', error)
                    addToast(createToast('danger', 'Failed to fetch job details'))
                } finally {
                    setLoading(false)
                }
            }
            fetchJobDetails()
        }
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Manual validation
        if (!formData.title.trim() || !formData.experience.trim() || !formData.skills.trim() || !formData.description.trim()) {
            addToast(createToast('danger', 'Please fill in all mandatory fields.'))
            return
        }

        setLoading(true)

        try {
            // Transform skills string to array of strings
            const skillsArray = formData.skills
                .split(',')
                .map((skill) => skill.trim())
                .filter((skill) => skill !== '')

            if (skillsArray.length === 0) {
                addToast(createToast('danger', 'Please provide at least one valid skill.'))
                setLoading(false)
                return
            }

            const dataToSend: JobDescription = {
                ...formData,
                skills: skillsArray,
            }

            if (isEditMode && id) {
                await jobService.updateJobDescription(id, dataToSend)
                addToast(createToast('success', 'Job description updated successfully!'))
                setTimeout(() => navigate('/job-descriptions'), 1500)
            } else {
                await jobService.createJobDescription(dataToSend)
                addToast(createToast('success', 'Job description created successfully!'))
                setFormData({
                    title: '',
                    experience: '',
                    skills: '',
                    description: '',
                })
            }
        } catch (error: any) {
            console.error('Error creating/updating job description:', error)
            const errorMsg = error.response?.data?.message || 'Failed to process job description. Please try again.'
            addToast(createToast('danger', errorMsg))
        } finally {
            setLoading(false)
        }
    }

    return (
        <CRow className='justify-content-center'>
            <CCol xs={12} md={8}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>{isEditMode ? 'Edit Job Description' : 'Create Job Description'}</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CToaster ref={toaster} push={toast} placement="top-end" />
                        <CForm onSubmit={handleSubmit} noValidate>
                            <div className="mb-3">
                                <CFormLabel htmlFor="title">
                                    Job Title <span className="text-danger">*</span>
                                </CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="title"
                                    placeholder="e.g. Senior Software Engineer"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="experience">
                                    Required Experience <span className="text-danger">*</span>
                                </CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="experience"
                                    placeholder="e.g. 5+ years"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="skills">
                                    Skill Set (comma separated) <span className="text-danger">*</span>
                                </CFormLabel>
                                <CFormInput
                                    type="text"
                                    id="skills"
                                    placeholder="e.g. React, Node.js, TypeScript"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <CFormLabel htmlFor="description">
                                    Job Description <span className="text-danger">*</span>
                                </CFormLabel>
                                <CFormTextarea
                                    id="description"
                                    rows={5}
                                    placeholder="Enter the full job description here..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></CFormTextarea>
                            </div>
                            <div className="col-auto">
                                <CButton color="primary" type="submit" disabled={loading}>
                                    {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Job' : 'Create Job')}
                                </CButton>
                            </div>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default CreateJobDescriptions