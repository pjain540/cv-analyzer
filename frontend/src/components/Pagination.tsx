import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    hasNext?: boolean
    hasPrev?: boolean
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    hasNext,
    hasPrev,
}) => {
    if (totalPages <= 1) return null

    const pages = []
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
    }

    return (
        <CPagination align="end" aria-label="Page navigation example" className="mt-3">
            <CPaginationItem
                disabled={!hasPrev || currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                style={{ cursor: 'pointer' }}
            >
                Previous
            </CPaginationItem>
            {pages.map((page) => (
                <CPaginationItem
                    key={page}
                    active={page === currentPage}
                    onClick={() => onPageChange(page)}
                    style={{ cursor: 'pointer' }}
                >
                    {page}
                </CPaginationItem>
            ))}
            <CPaginationItem
                disabled={!hasNext || currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                style={{ cursor: 'pointer' }}
            >
                Next
            </CPaginationItem>
        </CPagination>
    )
}

export default Pagination
