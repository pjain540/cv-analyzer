//@ts-nocheck
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { userService } from '../../../services/userService'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await userService.registerUser(formData)
      if (response.success) {
        navigate('/login')
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  {error && <div className="text-danger mb-3">{error}</div>}
                  <CRow className="mb-3">
                    <CCol xs={6}>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          name="firstName"
                          placeholder="First Name"
                          autoComplete="given-name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol xs={6}>
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          name="lastName"
                          placeholder="Last Name"
                          autoComplete="family-name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit" disabled={loading}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
