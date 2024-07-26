import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Form, Button, Spinner, Modal, InputGroup } from 'react-bootstrap';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser } from '../../redux/userRelated/userHandle';
import bgpic from "../../assets/school.jpg";
import styled from 'styled-components';

const AdminRegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false);
    const [loader, setLoader] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [adminNameError, setAdminNameError] = useState(false);
    const [schoolNameError, setSchoolNameError] = useState(false);
    const role = "Admin";

    const handleSubmit = (event) => {
        event.preventDefault();

        const name = event.target.adminName.value;
        const schoolName = event.target.schoolName.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!name || !schoolName || !email || !password) {
            if (!name) setAdminNameError(true);
            if (!schoolName) setSchoolNameError(true);
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        const fields = { name, email, password, role, schoolName };
        setLoader(true);
        dispatch(registerUser(fields, role));
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'adminName') setAdminNameError(false);
        if (name === 'schoolName') setSchoolNameError(false);
    };

    useEffect(() => {
        if (status === 'success' || (currentUser !== null && currentRole === 'Admin')) {
            navigate('/Admin/dashboard');
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            console.log(error);
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <Container fluid className="vh-100">
            <Row>
                <Col md={5} className="d-flex align-items-center justify-content-center">
                    <Form onSubmit={handleSubmit} className="w-75">
                        <h4 className="mb-3 text-center text-primary">Admin Register</h4>
                        <p className="text-center">Create your own school by registering as an admin. You will be able to add students and faculty and manage the system.</p>
                        <Form.Group controlId="adminName" className="mb-3">
                            <Form.Label>Enter your name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Name"
                                name="adminName"
                                isInvalid={adminNameError}
                                onChange={handleInputChange}
                            />
                            <Form.Control.Feedback type="invalid">Name is required</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="schoolName" className="mb-3">
                            <Form.Label>Create your school name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="School Name"
                                name="schoolName"
                                isInvalid={schoolNameError}
                                onChange={handleInputChange}
                            />
                            <Form.Control.Feedback type="invalid">School name is required</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Enter your email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                name="email"
                                isInvalid={emailError}
                                onChange={handleInputChange}
                            />
                            <Form.Control.Feedback type="invalid">Email is required</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={toggle ? 'text' : 'password'}
                                    placeholder="Password"
                                    name="password"
                                    isInvalid={passwordError}
                                    onChange={handleInputChange}
                                    autoComplete="current-password"
                                />
                                <InputGroup.Text onClick={() => setToggle(!toggle)}>
                                    {toggle ? <Visibility /> : <VisibilityOff />}
                                </InputGroup.Text>
                                <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="remember" className="mb-3">
                            <Form.Check type="checkbox" label="Remember me" />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100" disabled={loader}>
                            {loader ? <Spinner as="span" animation="border" size="sm" /> : "Register"}
                        </Button>
                        <div className="mt-3 text-center">
                            Already have an account? <Link to="/Adminlogin">Log in</Link>
                        </div>
                    </Form>
                </Col>
                <Col md={7} className="d-none d-md-block" style={{
                    backgroundImage: `url(${'https://erocon.in/wp-content/uploads/2018/02/C2-1-1024x527.jpg'})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}></Col>
            </Row>
            <Modal show={showPopup} onHide={() => setShowPopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPopup(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default AdminRegisterPage;

const StyledLink = styled(Link)`
  margin-top: 9px;
  text-decoration: none;
  color: #7f56da;
`;
