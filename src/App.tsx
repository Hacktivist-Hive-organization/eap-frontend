import { Route, Routes } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { RequestForm } from '@/pages/RequestPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/requests/new" element={<RequestForm />} />
    </Routes>
  );
}

export default App;
