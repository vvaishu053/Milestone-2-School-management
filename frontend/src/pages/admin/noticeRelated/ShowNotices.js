import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Spinner, Alert } from 'react-bootstrap';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAllNotices } from '../../../redux/noticeRelated/noticeHandle';
import { deleteUser } from '../../../redux/userRelated/userHandle';
import TableTemplate from '../../../components/TableTemplate';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate'; // Custom component for floating action buttons

const ShowNotices = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { noticesList, loading, error, response } = useSelector((state) => state.notice);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getAllNotices(currentUser._id, "Notice"));
    }, [currentUser._id, dispatch]);

    if (error) {
        console.error(error);
    }

    const deleteHandler = (deleteID, address) => {
        dispatch(deleteUser(deleteID, address))
            .then(() => {
                dispatch(getAllNotices(currentUser._id, "Notice"));
            });
    };

    const noticeColumns = [
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'details', label: 'Details', minWidth: 100 },
        { id: 'date', label: 'Date', minWidth: 170 },
    ];

    const noticeRows = noticesList && noticesList.length > 0 && noticesList.map((notice) => {
        const date = new Date(notice.date);
        const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
        return {
            title: notice.title,
            details: notice.details,
            date: dateString,
            id: notice._id,
        };
    });

    const NoticeButtonHaver = ({ row }) => {
        return (
            <>
                <Button variant="danger" onClick={() => deleteHandler(row.id, "Notice")}>
                    <DeleteIcon />
                </Button>
            </>
        );
    };

    const actions = [
        {
            icon: <NoteAddIcon color="primary" />, name: 'Add New Notice',
            action: () => navigate("/Admin/addnotice")
        },
        {
            icon: <DeleteIcon color="error" />, name: 'Delete All Notices',
            action: () => deleteHandler(currentUser._id, "Notices")
        }
    ];

    return (
        <Container>
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    {response ? (
                        <div className="d-flex justify-content-end mt-3">
                            <Button variant="success" onClick={() => navigate("/Admin/addnotice")}>
                                Add Notice
                            </Button>
                        </div>
                    ) : (
                        <Card>
                            <Card.Body>
                                {Array.isArray(noticesList) && noticesList.length > 0 &&
                                    <TableTemplate buttonHaver={NoticeButtonHaver} columns={noticeColumns} rows={noticeRows} />
                                }
                                <SpeedDialTemplate actions={actions} />
                            </Card.Body>
                        </Card>
                    )}
                </>
            )}
            {error && (
                <Alert variant="danger" className="mt-3">
                    {error}
                </Alert>
            )}
        </Container>
    );
};

export default ShowNotices;
