import { WorkshopWizard } from './components/workshop/WorkshopWizard';
import Layout from './components/ui/Layout';
import './index.css';

function App() {
  return (
    <div className="customercamp-theme">
      <Layout>
        <WorkshopWizard />
      </Layout>
    </div>
  );
}

export default App;
