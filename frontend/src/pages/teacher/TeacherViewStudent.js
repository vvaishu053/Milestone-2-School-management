import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Collapse, Table, Container, Row, Col } from 'react-bootstrap';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'; // Keep these as they are
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '../../components/attendanceCalculator';
import CustomPieChart from '../../components/CustomPieChart';
import { PurpleButton } from '../../components/buttonStyles'; // Ensure this is compatible with React-Bootstrap

const TeacherViewStudent = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { currentUser, userDetails, response, loading, error } = useSelector((state) => state.user);

    const address = "Student";
    const studentID = params.id;
    const teachSubject = currentUser.teachSubject?.subName;
    const teachSubjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getUserDetails(studentID, address));
    }, [dispatch, studentID]);

    if (response) { console.log(response); }
    else if (error) { console.log(error); }

    const [sclassName, setSclassName] = useState('');
    const [studentSchool, setStudentSchool] = useState('');
    const [subjectMarks, setSubjectMarks] = useState([]);
    const [subjectAttendance, setSubjectAttendance] = useState([]);

    const [openStates, setOpenStates] = useState({});

    const handleOpen = (subId) => {
        setOpenStates((prevState) => ({
            ...prevState,
            [subId]: !prevState[subId],
        }));
    };

    useEffect(() => {
        if (userDetails) {
            setSclassName(userDetails.sclassName || '');
            setStudentSchool(userDetails.school || '');
            setSubjectMarks(userDetails.examResult || []);
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
    const overallAbsentPercentage = 100 - overallAttendancePercentage;

    const chartData = [
        { name: 'Present', value: overallAttendancePercentage },
        { name: 'Absent', value: overallAbsentPercentage }
    ];

    return (
        <Container>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    <Row>
                        <Col>Name: {userDetails.name}</Col>
                    </Row>
                    <Row>
                        <Col>Roll Number: {userDetails.rollNum}</Col>
                    </Row>
                    <Row>
                        <Col>Class: {sclassName.sclassName}</Col>
                    </Row>
                    <Row>
                        <Col>School: {studentSchool.schoolName}</Col>
                    </Row>
                    <br />

                    <h3>Attendance:</h3>
                    {subjectAttendance && Array.isArray(subjectAttendance) && subjectAttendance.length > 0 && (
                        <>
                            {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(([subName, { present, allData, subId, sessions }], index) => {
                                if (subName === teachSubject) {
                                    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(present, sessions);

                                    return (
                                        <Table striped bordered hover key={index}>
                                            <thead>
                                                <tr>
                                                    <th>Subject</th>
                                                    <th>Present</th>
                                                    <th>Total Sessions</th>
                                                    <th>Attendance Percentage</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{subName}</td>
                                                    <td>{present}</td>
                                                    <td>{sessions}</td>
                                                    <td>{subjectAttendancePercentage}%</td>
                                                    <td>
                                                        <Button variant="primary" onClick={() => handleOpen(subId)}>
                                                            {openStates[subId] ? <KeyboardArrowUp /> : <KeyboardArrowDown />} Details
                                                        </Button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                                        <Collapse in={openStates[subId]}>
                                                            <div>
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
                                        </Table>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                            <div>
                                Overall Attendance Percentage: {overallAttendancePercentage.toFixed(2)}%
                            </div>

                            <CustomPieChart data={chartData} />
                        </>
                    )}
                    <br />
                    <Button
                        variant="primary"
                        onClick={() =>
                            navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)
                        }
                    >
                        Add Attendance
                    </Button>
                    <br /><br />
                    <h3>Subject Marks:</h3>

                    {subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0 && (
                        <>
                            {subjectMarks.map((result, index) => {
                                if (result.subName.subName === teachSubject) {
                                    return (
                                        <Table striped bordered hover key={index}>
                                            <thead>
                                                <tr>
                                                    <th>Subject</th>
                                                    <th>Marks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{result.subName.subName}</td>
                                                    <td>{result.marksObtained}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    );
                                } else if (!result.subName || !result.marksObtained) {
                                    return null;
                                }
                                return null;
                            })}
                        </>
                    )}
                    <PurpleButton
                        variant="primary"
                        onClick={() =>
                            navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)
                        }
                    >
                        Add Marks
                    </PurpleButton>
                    <br /><br />
                </div>
            )}
        </Container>
    );
};

export default TeacherViewStudent;
