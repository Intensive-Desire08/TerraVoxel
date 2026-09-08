import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProjectPage from './pages/ProjectPage';
import PolygonDrawerPage from './pages/PolygonDrawerPage';
import Scene3DPage from './pages/Scene3DPage';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/project/new" element={<ProjectPage />} />
        <Route path="/map/:project_id" element={<PolygonDrawerPage />} />
        <Route path="/scene/:project_id" element={<Scene3DPage />} />
      </Routes>
    </Router>
  );
}
