import React from 'react'
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CButton,
    CSpinner,
} from '@coreui/react'

interface DeleteModalProps {
    visible: boolean
    setVisible: (visible: boolean) => void
    title?: string
    message?: string
    onConfirm: () => Promise<void>
    loading?: boolean
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    visible,
    setVisible,
    title = 'Confirm Delete',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
    onConfirm,
    loading = false,
}) => {
    return (
        <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader>
                <CModalTitle>{title}</CModalTitle>
            </CModalHeader>
            <CModalBody>{message}</CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)} disabled={loading}>
                    Cancel
                </CButton>
                <CButton color="danger" onClick={onConfirm} disabled={loading}>
                    {loading ? <CSpinner size="sm" /> : 'Delete'}
                </CButton>
            </CModalFooter>
        </CModal>
    )
}

export default DeleteModal
