import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="cart"
            element={
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Your Cart</h2>
                <p className="text-slate-500 text-sm mt-1">Cart functionality will be implemented in subsequent tasks.</p>
              </div>
            }
          />
          <Route
            path="admin"
            element={
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
                <p className="text-slate-500 text-sm mt-1">Admin functionality will be implemented in subsequent tasks.</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
