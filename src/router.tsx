import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';

// Router component
const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
