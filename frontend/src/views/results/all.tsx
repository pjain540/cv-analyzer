import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CBadge,
    CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilList, cilTrash } from '@coreui/icons'
import analysisService from '../../services/analysisService'
import DataTable, { Column } from '../../components/DataTable'
import Pagination from '../../components/Pagination'
import DeleteModal from '../../components/DeleteModal'
import { createToast } from '../../utils/toastUtils'

const AllResults = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(1)
    const [hasNext, setHasNext] = useState(false)
    const [hasPrev, setHasPrev] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [limit] = useState(10)

    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [toast, addToast] = useState<React.ReactElement<any> | undefined>(undefined)
    const toaster = useRef<HTMLDivElement>(null)

    useEffect(() => {
        fetchData(currentPage)
    }, [currentPage])

    const fetchData = async (page: number) => {
        setLoading(true)
        try {
            const response = await analysisService.getAllAnalysis(page, limit)
            setData(response.data || [])
            setTotalPages(response.totalPages || 1)
            setHasNext(response.hasNext || false)
            setHasPrev(response.hasPrev || false)
            setCurrentPage(response.currentPage || 1)
        } catch (error) {
            console.error('Error fetching all analysis results:', error)
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const openDeleteModal = (id: string) => {
        setDeleteId(id)
        setDeleteModalVisible(true)
    }

    const handleDelete = async () => {
        if (!deleteId) return
        setDeleteLoading(true)
        try {
            await analysisService.deleteAnalysis(deleteId)
            addToast(createToast('success', 'Analysis deleted successfully'))
            setDeleteModalVisible(false)
            fetchData(currentPage)
        } catch (error) {
            console.error('Error deleting analysis:', error)
            addToast(createToast('danger', 'Failed to delete analysis'))
        } finally {
            setDeleteLoading(false)
        }
    }

    const columns: Column<any>[] = [
        {
            header: 'Job Title',
            field: 'jobDescription.title',
            render: (item) => (
                <div className="fw-semibold">
                    {item.jobDescription?.title || 'N/A'}
                </div>
            ),
        },
        {
            header: 'Experience',
            field: 'jobDescription.experience',
            render: (item) => item.jobDescription?.experience || 'N/A',
        },
        {
            header: 'Candidates',
            field: 'resumes',
            render: (item) => (
                <CBadge color="info" shape="rounded-pill">
                    {item.resumes?.length || 0} Candidates
                </CBadge>
            ),
        },
        {
            header: 'Analysis Date',
            field: 'createdAt',
            render: (item) => (
                <div className="small text-body-secondary text-nowrap">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                </div>
            ),
        },
        {
            header: 'Action',
            field: '_id',
            render: (item) => (
                <>
                    <CButton
                        color="primary"
                        variant="outline"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`/results/view/${item._id}`)}
                    >
                        <CIcon icon={cilSearch} />
                    </CButton>
                    <CButton
                        color="danger"
                        variant="outline"
                        size="sm"
                        onClick={() => item._id && openDeleteModal(item._id)}
                    >
                        <CIcon icon={cilTrash} />
                    </CButton>
                </>
            ),
        },
    ]

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <CIcon icon={cilList} className="me-2 text-primary" />
                            <strong>All Analysis Results</strong>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <CToaster ref={toaster} push={toast} placement="top-end" />
                        <DeleteModal
                            visible={deleteModalVisible}
                            setVisible={setDeleteModalVisible}
                            onConfirm={handleDelete}
                            loading={deleteLoading}
                            title="Delete Analysis"
                            message="Are you sure you want to delete this analysis result? This action cannot be undone."
                        />
                        <DataTable
                            data={data}
                            columns={columns}
                            loading={loading}
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

export default AllResults
