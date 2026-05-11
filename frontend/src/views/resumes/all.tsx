//@ts-nocheck
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMagnifyingGlass, cilTrash } from '@coreui/icons'
import { resumeService, Resume } from '../../services/resumeService'
import DeleteModal from '../../components/DeleteModal'
import Pagination from '../../components/Pagination'
import DataTable, { Column } from '../../components/DataTable'

const AllResumes = () => {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState<Resume[]>([])
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

  const columns: Column<Resume>[] = [
    {
      header: 'Name',
      field: 'name',
      render: (resume) => (
        <div className="fw-semibold text-capitalize">
          {resume.name}
        </div>
      ),
    },
    {
      header: 'Experience',
      field: 'experience',
    },
    {
      header: 'Role',
      field: 'role',
    },
    {
      header: 'Actions',
      align: 'center',
      render: (resume) => (
        <div className="text-center">
          <CButton
            color="primary"
            size="sm"
            variant="outline"
            className="me-2"
            onClick={() => navigate(`/resumes/view/${resume._id}`)}
            title="View Resume"
          >
            <CIcon icon={cilMagnifyingGlass} />
          </CButton>
          <CButton
            color="danger"
            size="sm"
            variant="outline"
            onClick={() => resume._id && openDeleteModal(resume._id)}
            title="Delete Resume"
          >
            <CIcon icon={cilTrash} />
          </CButton>
        </div>
      ),
    },
  ]

  const fetchResumes = async (page: number) => {
    setLoading(true)
    try {
      const result = await resumeService.getAllResumes(page, limit)
      setResumes(result.data || [])
      setTotalPages(result.totalPages || 1)
      setHasNext(result.hasNext || false)
      setHasPrev(result.hasPrev || false)
      setCurrentPage(result.currentPage || 1)
    } catch (error) {
      console.error('Error fetching resumes:', error)
      addToast(createToast('danger', 'Failed to fetch resumes'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes(currentPage)
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
      await resumeService.deleteResume(deleteId)
      addToast(createToast('success', 'Resume deleted successfully'))
      setDeleteModalVisible(false)
      setDeleteId(null)
      fetchResumes(currentPage) // Refresh current page
    } catch (error) {
      console.error('Error deleting resume:', error)
      addToast(createToast('danger', 'Failed to delete resume'))
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
            <strong>All Resumes</strong>
          </CCardHeader>
          <CCardBody>
            <CToaster ref={toaster} push={toast} placement="top-end" />
            <DeleteModal
              visible={deleteModalVisible}
              setVisible={setDeleteModalVisible}
              onConfirm={handleDelete}
              loading={deleteLoading}
              title="Delete Resume"
              message="Are you sure you want to delete this resume? This action cannot be undone."
            />
            <DataTable
              columns={columns}
              data={resumes}
              loading={loading}
              emptyMessage="No resumes found."
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

export default AllResumes
