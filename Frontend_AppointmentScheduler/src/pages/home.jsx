import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";


function Home() {
  const navigate = useNavigate();   
  return (
    <div className="Home">
      <NavBar />

      <div className="home-wrapper">
        <div className="home-content">

          <div className="left-content">

            <div className="Headings">
              <h1>
                Get Matched With Best Psychologists. We offer professional online counselling:
              </h1>

              <p>
                Affordable, Confidential & Expert Verified Psychologists. If you’re feeling
                stressed, anxious, or emotionally drained, we offers professional online
                counselling and therapy across India that is accessible, affordable, and
                completely confidential — with limited-time offers for fast expert support.
                Just Book an appointment down below!
              </p>
            </div>

            <button
              className="myButton"
              onClick={() => navigate("/BookAppointment")}
              type="button"
            >
              Book Appointment
            </button>

          </div>


          <div className="right-content">
            <img className="image" src="/therapy.png" alt="Book your therapy session" />

          </div>

        </div>
      </div>

    </div>
  );
}

export default Home;
