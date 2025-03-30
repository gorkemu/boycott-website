import React from 'react';
import ReactDOM from 'react-dom/client';
import CompaniesList from './components/CompaniesList';
import Login from './components/Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem('token'));
  const [routeChanged, setRouteChanged] = React.useState(false); // Add this state variable

  React.useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setRouteChanged(prev => !prev); // Force re-render when token changes
  }, [localStorage.getItem('token')]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setRouteChanged(prev => !prev)} />} /> {/* Pass a callback */}
        <Route
          path="/"
          element={isLoggedIn ? <CompaniesList /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
