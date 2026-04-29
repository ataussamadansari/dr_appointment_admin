import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppointmentDetail from './pages/AppointmentDetail.jsx';
import Appointments from './pages/Appointments.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DoctorSettings from './pages/DoctorSettings.jsx';
import Login from './pages/Login.jsx';
import Portfolio from './pages/Portfolio.jsx';
import PrescriptionEditor from './pages/PrescriptionEditor.jsx';
import Recordings from './pages/Recordings.jsx';
import VideoConsultation from './pages/VideoConsultation.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route index element={<Dashboard />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="appointments/:id" element={<AppointmentDetail />} />
        <Route path="appointments/:id/video" element={<VideoConsultation />} />
        <Route path="appointments/:id/prescription" element={<PrescriptionEditor />} />
        <Route path="settings" element={<DoctorSettings />} />
        <Route path="recordings" element={<Recordings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
