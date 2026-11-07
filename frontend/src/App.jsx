import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { TableProvider } from './context/TableContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import QRGenerator from './components/QRGenerator';

function App() {
  return (
    <BrowserRouter>
      <TableProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="menu" element={<HomePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route
                path="admin"
                element={
                  <div className="space-y-8">
                    <QRGenerator />
                  </div>
                }
              />
            </Route>
          </Routes>
        </CartProvider>
      </TableProvider>
    </BrowserRouter>
  );
}

export default App;
