import { Navbar, Nav, NavDropdown, Container, Button, Offcanvas } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../store/authSlice'
import ConfirmationPopup from './ConfirmationPopup'

function AppNavbar() {
    const { pathname } = useLocation()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const navigate = useNavigate()

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true)
    }

    const confirmLogout = () => {
        dispatch(logoutUser())
        setShowLogoutConfirm(false)
        navigate('/login')
    }

    return (
        <>
            <Navbar expand={"lg"} bg="white" className="border-bottom shadow-sm py-3">
                <Container>

                    <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-primary">
                        Navbar
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="offcanvas-navbar" />

                    <Navbar.Offcanvas
                        id="offcanvas-navbar"
                        aria-labelledby="offcanvas-navbar-label"
                        placement="end"
                    >

                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id="offcanvas-navbar-label" className="fw-bold text-primary">
                                MyApp
                            </Offcanvas.Title>
                        </Offcanvas.Header>

                        <Offcanvas.Body>

                            <Nav className="flex-grow-1 gap-1">

                                {user?.role === 'user' && (
                                    <Nav.Link
                                        as={Link} to="/"
                                        active={pathname === '/'}
                                        className="fw-medium d-flex align-items-center"
                                    >
                                        ReactBootstrapForm
                                    </Nav.Link>
                                )}
                                {user?.role === 'admin' && (
                                    <Nav.Link
                                        as={Link} to="/admin/dashboard"
                                        active={pathname === '/admin/dashboard'}
                                        className="fw-medium d-flex align-items-center text-primary"
                                    >
                                        <i className="bi bi-speedometer2 me-1"></i> Admin Panel
                                    </Nav.Link>
                                )}

                                {user?.role === 'manager' && (
                                    <Nav.Link
                                        as={Link} to="/manager/dashboard"
                                        active={pathname === '/manager/dashboard'}
                                        className="fw-medium d-flex align-items-center text-info"
                                    >
                                        <i className="bi bi-person-workspace me-1"></i> Manager Panel
                                    </Nav.Link>
                                )}
                            </Nav>

                            <Nav className="d-flex flex-row align-items-center gap-2 mt-3">
                                {user ? (
                                    <>
                                        <Nav.Link as={Link} to="/profile" className="p-0 me-2 d-flex align-items-center">
                                            {user.profileImage ? (
                                                <img 
                                                    src={user.profileImage.startsWith('http') ? user.profileImage : encodeURI(`/uploads/${user.profileImage}`)} 
                                                    alt="profile" 
                                                    className="rounded-circle" 
                                                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <i className="bi bi-person-circle fs-3 text-secondary"></i>
                                            )}
                                        </Nav.Link>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="px-3 rounded-3"
                                            onClick={handleLogoutClick}
                                        >
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                        <Button
                                            as={Link} to="/register"
                                            variant="primary"
                                            size="sm"
                                            className="px-3 rounded-3"
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                )}
                            </Nav>

                        </Offcanvas.Body>
                    </Navbar.Offcanvas>

                </Container>
            </Navbar>

            <ConfirmationPopup
                show={showLogoutConfirm}
                onHide={() => setShowLogoutConfirm(false)}
                onConfirm={confirmLogout}
                title="Confirm Logout"
                body="Are you sure you want to logout?"
                confirmText="Logout"
            />
        </>
    )
}

export default AppNavbar