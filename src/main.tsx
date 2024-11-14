// Importing necessary libraries and components
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';

// Creating the root element
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Rendering the application
root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
