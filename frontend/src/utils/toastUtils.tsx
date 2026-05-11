import React from 'react'
import { CToast, CToastBody, CToastHeader } from '@coreui/react'

/**
 * Creates a standard CoreUI toast element.
 * 
 * @param type - The type of toast: 'success' or 'danger'
 * @param message - The message to display in the toast body
 * @returns A React element representing the toast
 */
export const createToast = (type: 'success' | 'danger', message: string): React.ReactElement<any> => {
    return (
        <CToast 
            autohide={true} 
            visible={true} 
            color={type === 'success' ? 'success' : 'danger'} 
            className="text-white"
        >
            <CToastHeader closeButton>
                <div className="fw-bold me-auto">
                    {type === 'success' ? 'Success' : 'Error'}
                </div>
            </CToastHeader>
            <CToastBody>{message}</CToastBody>
        </CToast>
    )
}
