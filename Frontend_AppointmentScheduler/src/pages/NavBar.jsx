import { Navbar, Container, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate  = useNavigate();
  const role      = localStorage.getItem("role")?.toLowerCase();
  const isAdmin     = role === "admin";
  const isTherapist = role === "therapist";
  const isUser      = role === "user";  // ← ADD

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  return (
    <Navbar className="main-navbar">
      <Container fluid className="navbar-container">
        <Navbar.Brand href="/home" className="navbar-brand-custom">
          Appointment Scheduler
        </Navbar.Brand>

        <Nav className="navbar-links ms-auto">

          {isUser && (
            <>
              <Nav.Link as={Link} to="/home" className="nav-link-custom">Home</Nav.Link>
              <Nav.Link as={Link} to="/BookAppointment" className="nav-link-custom">Book Appointment</Nav.Link>
              <Nav.Link as={Link} to="/MyAppointments" className="nav-link-custom">My Appointments</Nav.Link>
            </>
          )}

          {isAdmin && (
            <Nav.Link as={Link} to="/admin" className="nav-link-custom admin-link">
              Admin Dashboard
            </Nav.Link>
          )}

          {isTherapist && (
            <Nav.Link as={Link} to="/therapist" className="nav-link-custom therapist-link">
              My Schedule
            </Nav.Link>
          )}

          <button className="logout-btn" onClick={handleLogout} type="button">
            Logout
          </button>

        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;