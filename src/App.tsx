import { WorkshopWizard } from './components/workshop/WorkshopWizard';
import { WorkshopLayout } from './components/layout/WorkshopLayout';
import './index.css';

function App() {
  return (
    <div className="customercamp-theme">
      <WorkshopLayout>
        <WorkshopWizard />
      </WorkshopLayout>
    </div>
  );
}

export default App;
