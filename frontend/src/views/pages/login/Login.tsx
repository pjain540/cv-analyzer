import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { useAuth } from '../../../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val.length > 0 && !emailRegex.test(val)) {
      setEmailError("Enter the valid Email address")
    } else {
      setEmailError("")

    }

  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // if (email.length === 0 && password.length === 0) {
    //   setLoginError("Please enter your email and password")
    //   return
    // }
    if (email.length === 0) {
      setEmailError("Email is required")
      return
    }
    if (password.length === 0) {
      setPasswordError("Password is required")
      return
    }
    if (emailError) return;
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }
    
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    {error && <div className="text-danger mb-3">{error}</div>}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        @
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                    </CInputGroup>
                    {emailError && <div className="text-danger mb-3">{emailError}</div>}

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    {passwordError && <div className="text-danger mb-3">{passwordError}</div>}
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit" disabled={loading}>
                          {loading ? 'Logging in...' : 'Login'}
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Join us today! Create an account to start analyzing your resumes and matching them with job descriptions efficiently.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
