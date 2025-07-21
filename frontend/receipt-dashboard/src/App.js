import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import UploadForm from './components/UploadForm';
import ReceiptTable from './components/ReceiptTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import ReceiptEditor from './components/ReceiptEditor.js';

function App() {
  return (
    <Router>
      <div className="d-flex" style={{ minHeight: '100vh' }}>
        {/* Sidebar */}
        <div className="bg-light text-dark p-3" style={{ width: '300px' }}>
          <h4 className="text-center">Receipt Manager</h4>
          <ul className="nav flex-column mt-4">
            <li className="nav-item">
              <Link to="/" className="nav-link text-dark">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/upload" className="nav-link text-dark">Upload Receipt</Link>
            </li>
            <li className="nav-item">
              <Link to="/receipts" className="nav-link text-dark">Receipts Table</Link>
            </li>
            <li className="nav-item">
              <Link to="/edit" className="nav-link text-dark">Receipts Review</Link>
            </li>
            
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow-2 container p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadForm />} />
            <Route path="/receipts" element={<ReceiptTable />} />
            <Route path="/edit" element={<ReceiptEditor />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
