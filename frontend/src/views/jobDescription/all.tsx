//@ts-nocheck
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CButton,
    CBadge,
    CSpinner,
    CToast,
    CToastBody,
    CToastHeader,
    CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import { jobService, JobDescription } from '../../services/jobService'
import DeleteModal from '../../components/DeleteModal'
import Pagination from '../../components/Pagination'
import DataTable, { Column } from '../../components/DataTable'

const AllJobDescriptions = () => {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState<JobDescription[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)
    const [limit] = useState(10)

    const [toast, addToast] = useState<React.ReactElement<any> | undefined>(undefined)
    const toaster = useRef<HTMLDivElement>(null)

    const columns: Column<JobDescription>[] = [
        {
            header: 'Title',
            field: 'title',
            render: (job) => (
                <div className="fw-semibold text-capitalize">
                    {job.title}
                </div>
            ),
        },
        {
            header: 'Experience',
            field: 'experience',
        },
        {
            header: 'Skills',
            align: 'center',
            render: (job) => (
                <div className="d-flex flex-wrap gap-1 justify-content-center">
                    {job.skills.slice(0, 3).map((skill, idx) => (
                        <CBadge key={idx} color="info" shape="rounded-pill">
                            {skill}
                        </CBadge>
                    ))}
                    {job.skills.length > 3 && (
                        <span className="text-muted small">...+{job.skills.length - 3} more</span>
                    )}
                </div>
            ),
        },
        {
            header: 'Created At',
            render: (job) => (
                <div className="small text-body-secondary text-nowrap">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                </div>
            ),
        },
        {
            header: 'Actions',
            align: 'center',
            render: (job) => (
                <div className="text-center">
                    <CButton
                        color="primary"
                        size="sm"
                        variant="outline"
                        className="me-2"
                        onClick={() => navigate(`/job-descriptions/edit/${job._id || job.id}`)}
                    >
                        <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                        color="danger"
                        size="sm"
                        variant="outline"
                        onClick={() => (job._id || job.id) && openDeleteModal(job._id || job.id)}
                    >
                        <CIcon icon={cilTrash} />
                    </CButton>
                </div>
            ),
        },
    ]

    const fetchJobs = async (page: number) => {
        setLoading(true)
        try {
            const result = await jobService.getAllJobDescriptions(page, limit)
            setJobs(result.data || [])
            setTotalPages(result.totalPages || 1)
            setHasNext(result.hasNext || false)
            setHasPrev(result.hasPrev || false)
            setCurrentPage(result.currentPage || 1)
        } catch (error) {
            console.error('Error fetching jobs:', error)
            addToast(createToast('danger', 'Failed to fetch job descriptions'))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs(currentPage)
    }, [currentPage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const createToast = (type: 'success' | 'danger', message: string): React.ReactElement<any> => {
        return (
            <CToast autohide={true} visible={true} color={type === 'success' ? 'success' : 'danger'} className="text-white">
                <CToastHeader closeButton>
                    <div className="fw-bold me-auto">{type === 'success' ? 'Success' : 'Error'}</div>
                </CToastHeader>
                <CToastBody>{message}</CToastBody>
            </CToast>
        )
    }

    const handleDelete = async () => {
        if (!deleteId) return

        setDeleteLoading(true)
        try {
            await jobService.deleteJobDescription(deleteId)
            addToast(createToast('success', 'Job description deleted successfully'))
            setDeleteModalVisible(false)
            setDeleteId(null)
            fetchJobs(currentPage) // Refresh current page
        } catch (error) {
            console.error('Error deleting job:', error)
            addToast(createToast('danger', 'Failed to delete job description'))
        } finally {
            setDeleteLoading(false)
        }
    }

    const openDeleteModal = (id: string) => {
        setDeleteId(id)
        setDeleteModalVisible(true)
    }

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>All Job Descriptions</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CToaster ref={toaster} push={toast} placement="top-end" />
                        <DeleteModal
                            visible={deleteModalVisible}
                            setVisible={setDeleteModalVisible}
                            onConfirm={handleDelete}
                            loading={deleteLoading}
                            title="Delete Job Description"
                            message="Are you sure you want to delete this job description? This action cannot be undone."
                        />
                        <DataTable
                            columns={columns}
                            data={jobs}
                            loading={loading}
                            emptyMessage="No job descriptions found."
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            hasNext={hasNext}
                            hasPrev={hasPrev}
                        />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default AllJobDescriptions