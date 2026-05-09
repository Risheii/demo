import { Navbar, Nav, NavDropdown, Container, Button, Offcanvas } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'

function AppNavbar() {
    const { pathname } = useLocation()

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
                                <Nav.Link
                                    as={Link} to="/"
                                    active={pathname === '/'}
                                    className="fw-medium d-flex align-items-center"
                                >
                                    ReactBootstrapForm
                                </Nav.Link>

                                <Nav.Link
                                    as={Link} to="/normal"
                                    active={pathname === '/normal'}
                                    className="fw-medium d-flex align-items-center"
                                >
                                    NormalForm
                                </Nav.Link>

                                <NavDropdown
                                    className='fw-medium d-flex align-items-center'
                                    title="Dropdown"
                                    id="offcanvas-dropdown"
                                    active={pathname.startsWith('/services')}
                                >
                                    <NavDropdown.Item as={Link} to="/services/web">
                                        Dropdown1
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/services/app">
                                        Dropdown2
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/services/design">
                                        Dropdown3
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <Nav.Link
                                    as={Link} to="/chart"
                                    active={pathname === '/chart'}
                                    className="fw-medium d-flex align-items-center"
                                >
                                    Chart
                                </Nav.Link>

                                <Nav.Link
                                    as={Link} to="/practice"
                                    active={pathname === '/practice'}
                                    className="fw-medium d-flex align-items-center"
                                >
                                    Practice
                                </Nav.Link>
                            </Nav>

                            <Nav className="d-flex flex-row align-items-center gap-2 mt-3">
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Button
                                    as={Link} to="/register"
                                    variant="primary"
                                    size="sm"
                                    className="px-3 rounded-3"
                                >
                                    Sign Up
                                </Button>
                            </Nav>

                        </Offcanvas.Body>
                    </Navbar.Offcanvas>

                </Container>
            </Navbar>
        </>
    )
}

export default AppNavbar