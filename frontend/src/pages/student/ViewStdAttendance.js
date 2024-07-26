import React, { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp, FaTable, FaChartBar } from 'react-icons/fa';
import { Container, Button, Collapse, Table, Spinner, Navbar, Nav } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';

import CustomBarChart from '../../components/CustomBarChart';

const ViewStdAttendance = () => {
    const dispatch = useDispatch();

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    const { userDetails, currentUser, loading, response, error } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(getUserDetails(currentUser._id, "Student"));
    }, [dispatch, currentUser._id]);

    if (response) { console.log(response) }
    else if (error) { console.log(error) }

    const [subjectAttendance, setSubjectAttendance] = useState([]);
    const [selectedSection, setSelectedSection] = useState('table');

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

    const subjectData = Object.entries(attendanceBySubject).map(([subName, { subCode, present, sessions }]) => {
        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);
        return {
            subject: subName,
            attendancePercentage: subjectAttendancePercentage,
            totalClasses: sessions,
            attendedClasses: present
        };
    });

    const handleSectionChange = (newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => {
        return (
            <Container>
                <h4 className="text-center my-4">Attendance</h4>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Present</th>
                            <th>Total Sessions</th>
                            <th>Attendance Percentage</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    {Object.entries(attendanceBySubject).map(([subName, { present, allData, subId, sessions }], index) => {
                        const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

                        return (
                            <tbody key={index}>
                                <tr>
                                    <td>{subName}</td>
                                    <td>{present}</td>
                                    <td>{sessions}</td>
                                    <td>{subjectAttendancePercentage}%</td>
                                    <td className="text-center">
                                        <Button variant="primary" onClick={() => handleOpen(subId)}>
                                            {openStates[subId] ? <FaArrowUp /> : <FaArrowDown />} Details
                                        </Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={5} className="p-0">
                                        <Collapse in={openStates[subId]}>
                                            <div className="m-2">
                                                <h6>Attendance Details</h6>
                                                <Table size="sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Date</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {allData.map((data, index) => {
                                                            const date = new Date(data.date);
                                                            const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{dateString}</td>
                                                                    <td>{data.status}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Collapse>
                                    </td>
                                </tr>
                            </tbody>
                        );
                    })}
                </Table>
                <div>
                    Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                </div>
            </Container>
        );
    };

    const renderChartSection = () => {
        return (
            <Container>
                <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
            </Container>
        );
    };

    return (
        <>
            {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" />
                </div>
            ) : (
                <div>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 ? (
                        <>
                            {selectedSection === 'table' && renderTableSection()}
                            {selectedSection === 'chart' && renderChartSection()}

                            <Navbar fixed="bottom" bg="light">
                                <Nav className="m-auto">
                                    <Nav.Item>
                                        <Nav.Link onClick={() => handleSectionChange('table')} active={selectedSection === 'table'}>
                                            <FaTable /> Table
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link onClick={() => handleSectionChange('chart')} active={selectedSection === 'chart'}>
                                            <FaChartBar /> Chart
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Navbar>
                        </>
                    ) : (
                        <Container>
                            <h6 className="text-center my-4">Currently You Have No Attendance Details</h6>
                        </Container>
                    )}
                </div>
            )}
        </>
    );
};

export default ViewStdAttendance;
