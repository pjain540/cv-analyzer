import React from 'react'
import {
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CSpinner,
} from '@coreui/react'

export interface Column<T> {
    header: string
    field?: keyof T | string
    render?: (item: T) => React.ReactNode
    align?: 'start' | 'center' | 'end'
}

interface DataTableProps<T> {
    columns: Column<T>[]
    data: T[]
    loading?: boolean
    emptyMessage?: string
}

const DataTable = <T extends { id?: string; _id?: string }>({
    columns,
    data,
    loading = false,
    emptyMessage = 'No data found.',
}: DataTableProps<T>) => {
    return (
        <>
            {loading ? (
                <div className="text-center p-5">
                    <CSpinner color="primary" />
                </div>
            ) : (
                <CTable align="middle" className="mb-0 border" hover responsive>
                    <CTableHead className="text-nowrap">
                        <CTableRow>
                            {columns.map((col, index) => (
                                <CTableHeaderCell
                                    key={index}
                                    className={`bg-body-tertiary ${col.align ? `text-${col.align}` : ''}`}
                                >
                                    {col.header}
                                </CTableHeaderCell>
                            ))}
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {data.length === 0 ? (
                            <CTableRow>
                                <CTableDataCell colSpan={columns.length} className="text-center p-4 text-muted">
                                    {emptyMessage}
                                </CTableDataCell>
                            </CTableRow>
                        ) : (
                            data.map((item, rowIndex) => (
                                <CTableRow key={item._id || item.id || rowIndex}>
                                    {columns.map((col, colIndex) => (
                                        <CTableDataCell
                                            key={colIndex}
                                            className={col.align ? `text-${col.align}` : ''}
                                        >
                                            {col.render
                                                ? col.render(item)
                                                : col.field
                                                ? (item[col.field as keyof T] as React.ReactNode)
                                                : null}
                                        </CTableDataCell>
                                    ))}
                                </CTableRow>
                            ))
                        )}
                    </CTableBody>
                </CTable>
            )}
        </>
    )
}

export default DataTable
