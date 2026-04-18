import './App.css'
import Login from './pages/login';
import { Routes, Route } from "react-router-dom";
import Home from './pages/home';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import Register from './pages/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/BookAppointment" element={<BookAppointment />} />
      <Route path="/MyAppointments" element={<MyAppointments />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/therapist" element={<TherapistDashboard />} />
    </Routes>
  );
}

export default App;