import { Routes, Route, Navigate } from 'react-router-dom';
import { WorkshopWizard } from './components/workshop/WorkshopWizard';
import { WorkshopLayout } from './components/layout/WorkshopLayout';
import './index.css';

function App() {
  return (
    <div className="customercamp-theme">
      <WorkshopLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/step/1" replace />} />
          <Route path="/step/:stepNumber" element={<WorkshopWizard />} />
          <Route path="*" element={<Navigate to="/step/1" replace />} />
        </Routes>
      </WorkshopLayout>
    </div>
  );
}

export default App;
