import { useEffect } from "react";
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getClassStudents } from "../../redux/sclassRelated/sclassHandle";
import { Dropdown, Container, Row, Col, Table, Spinner, ButtonGroup, Button } from 'react-bootstrap';
import { BlackButton, BlueButton } from "../../components/buttonStyles";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const TeacherClassDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { sclassStudents, loading, error, getresponse } = useSelector((state) => state.sclass);

    const { currentUser } = useSelector((state) => state.user);
    const classID = currentUser.teachSclass?._id;
    const subjectID = currentUser.teachSubject?._id;

    useEffect(() => {
        dispatch(getClassStudents(classID));
    }, [dispatch, classID]);

    if (error) {
        console.log(error);
    }

    const studentColumns = [
        { id: 'name', label: 'Name' },
        { id: 'rollNum', label: 'Roll Number' },
    ];

    const studentRows = sclassStudents.map((student) => {
        return {
            name: student.name,
            rollNum: student.rollNum,
            id: student._id,
        };
    });

    const StudentsButtonHaver = ({ row }) => {
        const options = ['Take Attendance', 'Provide Marks'];

        const [open, setOpen] = React.useState(false);
        const anchorRef = React.useRef(null);
        const [selectedIndex, setSelectedIndex] = React.useState(0);

        const handleClick = () => {
            if (selectedIndex === 0) {
                handleAttendance();
            } else if (selectedIndex === 1) {
                handleMarks();
            }
        };

        const handleAttendance = () => {
            navigate(`/Teacher/class/student/attendance/${row.id}/${subjectID}`);
        };

        const handleMarks = () => {
            navigate(`/Teacher/class/student/marks/${row.id}/${subjectID}`);
        };

        const handleMenuItemClick = (event, index) => {
            setSelectedIndex(index);
            setOpen(false);
        };

        const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
        };

        const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return;
            }
            setOpen(false);
        };

        return (
            <>
                <BlueButton
                    variant="primary"
                    onClick={() =>
                        navigate("/Teacher/class/student/" + row.id)
                    }
                >
                    View
                </BlueButton>
                <ButtonGroup ref={anchorRef} aria-label="split button">
                    <Button onClick={handleClick}>{options[selectedIndex]}</Button>
                    <BlackButton
                        size="sm"
                        aria-controls={open ? 'split-button-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="menu"
                        onClick={handleToggle}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </BlackButton>
                </ButtonGroup>
                <Dropdown.Menu show={open} as={Dropdown} className="shadow">
                    {options.map((option, index) => (
                        <Dropdown.Item
                            key={option}
                            disabled={index === 2}
                            active={index === selectedIndex}
                            onClick={(event) => handleMenuItemClick(event, index)}
                        >
                            {option}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </>
        );
    };

    return (
        <Container>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    <h4 className="text-center my-4">Class Details</h4>
                    {getresponse ? (
                        <div className="d-flex justify-content-end mt-4">
                            No Students Found
                        </div>
                    ) : (
                        <div className="overflow-auto">
                            <h5 className="mb-4">Students List:</h5>
                            {Array.isArray(sclassStudents) && sclassStudents.length > 0 && (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            {studentColumns.map((column) => (
                                                <th key={column.id}>{column.label}</th>
                                            ))}
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentRows.map((row) => (
                                            <tr key={row.id}>
                                                <td>{row.name}</td>
                                                <td>{row.rollNum}</td>
                                                <td>
                                                    <StudentsButtonHaver row={row} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </div>
                    )}
                </>
            )}
        </Container>
    );
};

export default TeacherClassDetails;
