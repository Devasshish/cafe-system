import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const TableContext = createContext();

const TABLE_STORAGE_KEY = 'cafe_royale_table';

export const TableProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tableNumber, setTableNumberState] = useState(() => {
    // 1. Check URL query params first
    const tableParam = new URLSearchParams(window.location.search).get('table');
    if (tableParam && tableParam.trim()) {
      const clean = tableParam.trim().toUpperCase();
      try {
        localStorage.setItem(TABLE_STORAGE_KEY, clean);
      } catch (e) {
        console.error(e);
      }
      return clean;
    }

    // 2. Check localStorage fallback
    try {
      const stored = localStorage.getItem(TABLE_STORAGE_KEY);
      return stored ? stored.trim().toUpperCase() : '';
    } catch (e) {
      return '';
    }
  });

  // Watch for changes in searchParams
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam && tableParam.trim()) {
      const clean = tableParam.trim().toUpperCase();
      setTableNumberState(clean);
      try {
        localStorage.setItem(TABLE_STORAGE_KEY, clean);
      } catch (e) {
        console.error(e);
      }
    }
  }, [searchParams]);

  const setTableNumber = (num) => {
    const clean = num ? num.trim().toUpperCase() : '';
    setTableNumberState(clean);
    try {
      if (clean) {
        localStorage.setItem(TABLE_STORAGE_KEY, clean);
      } else {
        localStorage.removeItem(TABLE_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const clearTableNumber = () => {
    setTableNumberState('');
    try {
      localStorage.removeItem(TABLE_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <TableContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        clearTableNumber,
        hasTable: Boolean(tableNumber),
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTable must be used within a TableProvider');
  }
  return context;
};

export default TableContext;

