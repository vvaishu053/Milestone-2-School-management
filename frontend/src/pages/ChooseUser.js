import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import Popup from '../components/Popup';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ChooseUser = ({ visitor }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = "zxc";

  const { status, currentUser, currentRole } = useSelector(state => state.user);

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const navigateHandler = (user) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Adminlogin');
      }
    } else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1";
        const studentName = "Dipesh Awasthi";
        const fields = { rollNum, studentName, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Studentlogin');
      }
    } else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Teacherlogin');
      }
    } else if (user === "Parent") {
      if (visitor === "guest") {
        const email = "mom@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user));
      } else {
        navigate('/Parentlogin');
      }
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      } else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      } else if (currentRole === 'Parent') {
        navigate('/Parent/dashboard');
      }
    } else if (status === 'error') {
      setLoader(false);
      setMessage("Network Error");
      setShowPopup(true);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <div className="container" style={{ background: 'linear-gradient(to bottom, #FFFFFF, #FFFFFF)', height: '120vh', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div className="row justify-content-center">
        <div className="col-xs-12 col-sm-6 col-md-3 mb-3">
          <div className="card text-center" onClick={() => navigateHandler("Admin")} style={{ backgroundColor: 'rgb(128, 0, 0)', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' }}>
            <div className="card-body">
              <div className="mb-2">
              <i className="material-icons" style={{ fontSize: '36px' }}>
                <img src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg" width="100px" height="100px"
                  style={{borderRadius: '50%', border: '3px solid rgb(128,0,0)' }}  alt="Avatar" /> </i>
              </div>
              <h4 className="card-title">Admin</h4>
              <p className="card-text">Login as an administrator to access the dashboard to manage app data.</p>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-3 mb-3">
          <div className="card text-center" onClick={() => navigateHandler("Student")} style={{ backgroundColor: 'rgb(128, 0, 0)', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' }}>
            <div className="card-body">
              <div className="mb-2">
              <i className="material-icons" style={{ fontSize: '36px' }}>
                <img src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg" width="100px" height="100px"
                  style={{borderRadius: '50%', border: '3px solid rgb(128,0,0)' }}  alt="Avatar" /> </i>
              </div>
              <h4 className="card-title">Student</h4>
              <p className="card-text">Login as a student to explore course materials and assignments.</p>
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-3 mb-3">
          <div className="card text-center" onClick={() => navigateHandler("Teacher")} style={{ backgroundColor: 'rgb(128, 0, 0)', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' }}>
            <div className="card-body">
              <div className="mb-2">
              <i className="material-icons" style={{ fontSize: '36px' }}>
                <img src="https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg" width="100px" height="100px"
                  style={{borderRadius: '50%', border: '3px solid rgb(128,0,0)' }}  alt="Avatar" /> </i>
              </div>
              <h4 className="card-title">Teacher</h4>
              <p className="card-text">Login as a teacher to create courses, assignments, and track student progress.</p>
            </div>
          </div>
        </div>
        {/* <div className="col-xs-12 col-sm-6 col-md-3 mb-3">
          <div className="card text-center" onClick={() => navigateHandler("Parent")} style={{ backgroundColor: '#1f1f38', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer' }}>
            <div className="card-body">
              <div className="mb-2">
                <i className="material-icons" style={{ fontSize: '36px' }}>person</i>
              </div>
              <h4 className="card-title">Parent</h4>
              <p className="card-text">Login as a parent to check attendance status and marks.</p>
            </div>
          </div>
        </div> */}
      </div>

      {loader && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content text-center">
              <div className="modal-body">
                <div className="spinner-border text-light" role="status"></div>
                <div>Please Wait</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
    </div>
  );
};

export default ChooseUser;