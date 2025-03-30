import React from 'react';
import ReactDOM from 'react-dom/client';
import CompaniesList from './components/CompaniesList';

function App() {
  return (
    <div>
      <CompaniesList />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);