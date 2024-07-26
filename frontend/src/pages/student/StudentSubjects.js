import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';
import { Container, Table, Spinner, Navbar, Nav } from 'react-bootstrap';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import CustomBarChart from '../../components/CustomBarChart';
import { BsTable, BsTable2, BsBarChart, BsBarChartLine } from 'react-icons/bs';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const StudentSubjects = () => {
    const dispatch = useDispatch();
    const { subjectsList, sclassDetails } = useSelector((state) => state.sclass);
    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    if (response) {
        console.log(response);
    } else if (error) {
        console.log(error);
    }

    const [subjectMarks, setSubjectMarks] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectMarks(userDetails.examResult || []);
        }
    }, [userDetails]);

    useEffect(() => {
        if (subjectMarks.length === 0) {
            dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects"));
        }
    }, [subjectMarks, dispatch, currentUser.sclassName._id]);

    const handleSectionChange = (newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => (
        <>
            <h4 className="text-center my-4">Subject Marks</h4>
            <Table striped bordered hover>
                <thead>
                    <StyledTableRow>
                        <StyledTableCell>Subject</StyledTableCell>
                        <StyledTableCell>Marks</StyledTableCell>
                    </StyledTableRow>
                </thead>
                <tbody>
                    {subjectMarks.map((result, index) => {
                        if (!result.subName || !result.marksObtained) {
                            return null;
                        }
                        return (
                            <StyledTableRow key={index}>
                                <StyledTableCell>{result.subName.subName}</StyledTableCell>
                                <StyledTableCell>{result.marksObtained}</StyledTableCell>
                            </StyledTableRow>
                        );
                    })}
                </tbody>
            </Table>
        </>
    );

    const renderChartSection = () => <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />;

    const renderClassDetailsSection = () => (
        <Container>
            <h4 className="text-center my-4">Class Details</h4>
            <h5>You are currently in Class {sclassDetails && sclassDetails.sclassName}</h5>
            <h6>And these are the subjects:</h6>
            {subjectsList &&
                subjectsList.map((subject, index) => (
                    <div key={index}>
                        <p>{subject.subName} ({subject.subCode})</p>
                    </div>
                ))}
        </Container>
    );

    return (
        <>
            {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" />
                </div>
            ) : (
                <div>
                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 ? (
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            <Navbar fixed="bottom" bg="light">
                                <Nav className="m-auto">
                                    <Nav.Item>
                                        <Nav.Link onClick={() => handleSectionChange('table')} active={selectedSection === 'table'}>
                                            <BsTable /> Table
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link onClick={() => handleSectionChange('chart')} active={selectedSection === 'chart'}>
                                            <BsBarChart /> Chart
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Navbar>
                        </>
                    ) : (
                        renderClassDetailsSection()
                    )}
                </div>
            )}
        </>
    );
};

export default StudentSubjects;
