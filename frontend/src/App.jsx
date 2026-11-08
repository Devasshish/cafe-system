import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { TableProvider } from './context/TableContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import NotesPage from './pages/NotesPage';
import ReviewsPage from './pages/ReviewsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TableProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="menu" element={<HomePage />} />
                <Route path="notes" element={<NotesPage />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="feedback" element={<ReviewsPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="admin" element={<AdminPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </CartProvider>
        </TableProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
