import { Routes, Route } from 'react-router-dom';
import Invitacion from './Invitacion';

function App() {
  return (
    <Routes>
      <Route path="/invitacion/:token" element={<Invitacion />} />
      <Route path="/" element={<Invitacion />} />
    </Routes>
  );
}

export default App;