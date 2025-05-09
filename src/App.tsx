import { Routes, Route, Navigate } from 'react-router-dom';
import { WorkshopWizard } from './components/workshop/WorkshopWizard';
import { WorkshopLayout } from './components/layout/WorkshopLayout';
import { Step01_Intro } from './components/workshop/steps/Intro_LandingPage';
import './index.css';

function App() {
  return (
    <div className="customercamp-theme">
      <WorkshopLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/intro" replace />} />
          <Route path="/intro" element={<Step01_Intro />} />
          <Route path="/step/:stepNumber" element={<WorkshopWizard />} />
          <Route path="*" element={<Navigate to="/intro" replace />} />
        </Routes>
      </WorkshopLayout>
    </div>
  );
}

export default App;
