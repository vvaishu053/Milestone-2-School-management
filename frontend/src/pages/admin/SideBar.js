import * as React from 'react';
import { Nav, Container, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaSignOutAlt, FaUserCircle, FaBullhorn, FaChalkboardTeacher, FaBook, FaRegFileAlt } from 'react-icons/fa';

const iconStyle = { marginRight: '8px' };

const SideBar = () => {
    const location = useLocation();
    const activePath = location.pathname;

    return (
        <Container fluid>
            <Row>
                <Col md={2} className="bg-light p-3">
                    <Nav className="flex-column">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/" active={activePath === "/" || activePath.startsWith("/Admin/dashboard")}>
                                <FaHome style={iconStyle} />
                                Home
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/Admin/classes" active={activePath.startsWith('/Admin/classes')}>
                                <FaChalkboardTeacher style={iconStyle} />
                                Classes
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/Admin/subjects" active={activePath.startsWith("/Admin/subjects")}>
                                <FaBook style={iconStyle} />
                                Subjects
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/Admin/teachers" active={activePath.startsWith("/Admin/teachers")}>
                                <FaUserCircle style={iconStyle} />
                                Teachers
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/Admin/students" active={activePath.startsWith("/Admin/students")}>
                                <FaUser style={iconStyle} />
                                Students
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/Admin/notices" active={activePath.startsWith("/Admin/notices")}>
                                <FaBullhorn style={iconStyle} />
                                Notices
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/Admin/complains" active={activePath.startsWith("/Admin/complains")}>
                                <FaRegFileAlt style={iconStyle} />
                                Complains
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <hr />
                    <Nav className="flex-column">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/Admin/profile" active={activePath.startsWith("/Admin/profile")}>
                                <FaUserCircle style={iconStyle} />
                                Profile
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/logout" active={activePath === "/logout"}>
                                <FaSignOutAlt style={iconStyle} />
                                Logout
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
            </Row>
        </Container>
    );
};

export default SideBar;
