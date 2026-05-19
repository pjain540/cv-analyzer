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
import { useAuth } from '../../../context/AuthContext'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { login } = useAuth()

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
        await login({ email: formData.email, password: formData.password })
        navigate('/dashboard')
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
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      invalid={!!formErrors.password}
                      required
                    />
                    <CInputGroupText style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-1.28 1.624-3.04 2.843-5.168 2.843s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.173 8z"/>
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                          <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a8.8 8.8 0 0 0-2.79.488l.77.77A7.7 7.7 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.45-.743.89-1.201 1.282zM8 5.5a2.5 2.5 0 0 1 2.5 2.5q0 .127-.018.25l1.492 1.492A3.5 3.5 0 0 0 8 4.5q-.127 0-.25.018l-1.5 1.5A2.5 2.5 0 0 1 8 5.5M4.832 4.417a8 8 0 0 0-1.078 1.101C2.479 6.812 2 8 2 8s3 5.5 8 5.5a7 7 0 0 0 2.767-.585l-.995-.995A6 6 0 0 1 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8q.086-.13.195-.289c.253-.327.568-.673.914-.997z"/>
                          <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299-1.05-1.05a2.5 2.5 0 0 1-2.827-2.828l-1.1-1.1A3.5 3.5 0 0 0 8 10.5c.12 0 .238-.01.354-.025z"/>
                          <path d="m8 13.5-.756-.756a8.8 8.8 0 0 1-3.434-1.287L2.83 12.443A10 10 0 0 0 8 13.5m0-11c.71 0 1.39.08 2.04.22l.85-.85A10 10 0 0 0 8 1.5z"/>
                        </svg>
                      )}
                    </CInputGroupText>
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
