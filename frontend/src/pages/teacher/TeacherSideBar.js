import * as React from 'react';
import { Nav, ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import { useSelector } from 'react-redux';

const TeacherSideBar = () => {
    const { currentUser } = useSelector((state) => state.user);
    const sclassName = currentUser.teachSclass;

    const location = useLocation();

    const getLinkProps = (path) => ({
        as: Link,
        to: path,
        active: location.pathname.startsWith(path),
    });

    return (
        <Nav className="flex-column">
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <Nav.Link {...getLinkProps("/")}>
                        <HomeIcon color={location.pathname === ("/" || "/Teacher/dashboard") ? 'primary' : 'inherit'} />
                        Home
                    </Nav.Link>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Nav.Link {...getLinkProps("/Teacher/class")}>
                        <ClassOutlinedIcon color={location.pathname.startsWith("/Teacher/class") ? 'primary' : 'inherit'} />
                        {`Class ${sclassName?.sclassName}`}
                    </Nav.Link>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Nav.Link {...getLinkProps("/Teacher/complain")}>
                        <AnnouncementOutlinedIcon color={location.pathname.startsWith("/Teacher/complain") ? 'primary' : 'inherit'} />
                        Complain
                    </Nav.Link>
                </ListGroup.Item>
            </ListGroup>
            <hr className="my-3" />
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <Nav.Link {...getLinkProps("/Teacher/profile")}>
                        <AccountCircleOutlinedIcon color={location.pathname.startsWith("/Teacher/profile") ? 'primary' : 'inherit'} />
                        Profile
                    </Nav.Link>
                </ListGroup.Item>
                <ListGroup.Item>
                    <Nav.Link {...getLinkProps("/logout")}>
                        <ExitToAppIcon color={location.pathname.startsWith("/logout") ? 'primary' : 'inherit'} />
                        Logout
                    </Nav.Link>
                </ListGroup.Item>
            </ListGroup>
        </Nav>
    );
}

export default TeacherSideBar;
