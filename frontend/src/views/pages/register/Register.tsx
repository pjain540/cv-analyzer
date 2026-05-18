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
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validateField = (name: string, value: string) => {
    let errorMsg = ''
    if (value.length === 0) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
      return
    }
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!/^[a-zA-Z]+$/.test(value)) {
          errorMsg = 'Must contain only letters'
        }
        break
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errorMsg = 'Enter a valid email address'
        }
        break
      case 'password':
        if (value.length < 8) {
          errorMsg = 'Password must be at least 8 characters'
        }
        break
      default:
        break
    }
    setFormErrors(prev => ({ ...prev, [name]: errorMsg }))
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target

    // Prevent typing non-letters in firstName and lastName
    if ((name === 'firstName' || name === 'lastName') && !/^[a-zA-Z]*$/.test(value)) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleRegister = async (e: any) => {
    e.preventDefault()
    setError('')

    const isFirstNameValid = /^[a-zA-Z]+$/.test(formData.firstName)
    const isLastNameValid = /^[a-zA-Z]+$/.test(formData.lastName)
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    const isPasswordValid = formData.password.length >= 8

    let hasErrors = false
    const newErrors = { firstName: '', lastName: '', email: '', password: '' }

    if (!formData.firstName || !isFirstNameValid) {
      newErrors.firstName = !formData.firstName ? 'First name is required' : 'Must contain only letters'
      hasErrors = true
    }
    if (!formData.lastName || !isLastNameValid) {
      newErrors.lastName = !formData.lastName ? 'Last name is required' : 'Must contain only letters'
      hasErrors = true
    }
    if (!formData.email || !isEmailValid) {
      newErrors.email = !formData.email ? 'Email is required' : 'Enter a valid email address'
      hasErrors = true
    }
    if (!formData.password || !isPasswordValid) {
      newErrors.password = !formData.password ? 'Password is required' : 'Password must be at least 8 characters'
      hasErrors = true
    }

    setFormErrors(newErrors)
    if (hasErrors) return

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
                          invalid={!!formErrors.firstName}
                          maxLength={10}
                          required
                        />
                      </CInputGroup>
                      {formErrors.firstName && <div className="text-danger mt-1 mb-2" style={{ fontSize: '0.875em' }}>{formErrors.firstName}</div>}
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
                          invalid={!!formErrors.lastName}
                          maxLength={10}
                          required
                        />
                      </CInputGroup>
                      {formErrors.lastName && <div className="text-danger mt-1 mb-2" style={{ fontSize: '0.875em' }}>{formErrors.lastName}</div>}
                    </CCol>
                  </CRow>

                  <CInputGroup className={formErrors.email ? "mb-1" : "mb-3"}>
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      invalid={!!formErrors.email}
                      required
                    />
                  </CInputGroup>
                  {formErrors.email && <div className="text-danger mb-3" style={{ fontSize: '0.875em' }}>{formErrors.email}</div>}

                  <CInputGroup className={formErrors.password ? "mb-1" : "mb-3"}>
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
                      invalid={!!formErrors.password}
                      required
                    />
                  </CInputGroup>
                  {formErrors.password && <div className="text-danger mb-3" style={{ fontSize: '0.875em' }}>{formErrors.password}</div>}
                  <div className="d-grid">
                    <CButton color="success" type="submit" disabled={loading || Object.values(formErrors).some(err => err !== '')}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </CButton>
                  </div>
                </CForm>
                <p className='text-center pt-2'>Do you have an account? <a href="/#/login">Login here</a></p>

              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
