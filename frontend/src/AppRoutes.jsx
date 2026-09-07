import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/map/default-project" replace />} />
        <Route path="/map/:project_id" element={<div className="glass-panel" style={{margin: '2rem', padding: '1rem'}}>Map Module Placeholder</div>} />
        <Route path="/scene/:project_id" element={<div className="glass-panel" style={{margin: '2rem', padding: '1rem'}}>3D Scene Module Placeholder</div>} />
      </Routes>
    </Router>
  );
}
