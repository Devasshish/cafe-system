import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Download,
  ExternalLink,
  QrCode,
  Copy,
  Check,
  Plus,
  Trash2,
  MapPin,
  AlertCircle,
  Loader2,
  Layers,
} from 'lucide-react';
import api from '../services/api';

const QRGenerator = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  // New Table Form States
  const [newTableNumber, setNewTableNumber] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const qrRef = useRef(null);

  // Fetch tables from backend
  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/tables');
      if (res.data && res.data.success) {
        const fetchedTables = res.data.data || [];
        setTables(fetchedTables);

        // Auto select first table if available
        if (fetchedTables.length > 0) {
          setSelectedTable((prev) =>
            fetchedTables.some((t) => t.tableNumber === prev)
              ? prev
              : fetchedTables[0].tableNumber
          );
        } else {
          setSelectedTable('');
        }
      }
    } catch (err) {
      console.error('Failed to fetch tables:', err);
      setError('Failed to load registered tables. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Add a new custom table
  const handleAddTable = async (e) => {
    e.preventDefault();
    if (!newTableNumber.trim() || isAdding) return;

    setIsAdding(true);
    setError(null);

    try {
      const res = await api.post('/tables', {
        tableNumber: newTableNumber.trim().toUpperCase(),
      });

      if (res.data && res.data.success) {
        const created = res.data.data;
        const updated = [...tables, created];
        setTables(updated);
        setSelectedTable(created.tableNumber);
        setNewTableNumber('');
      }
    } catch (err) {
      console.error('Failed to add table:', err);
      setError(err.response?.data?.message || 'Could not add table. It may already exist.');
    } finally {
      setIsAdding(false);
    }
  };

  // Delete a table
  const handleDeleteTable = async (id, tableNum, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to remove table "${tableNum}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await api.delete(`/tables/${id}`);
      if (res.data && res.data.success) {
        const remaining = tables.filter((t) => t._id !== id);
        setTables(remaining);

        if (selectedTable === tableNum) {
          setSelectedTable(remaining.length > 0 ? remaining[0].tableNumber : '');
        }
      }
    } catch (err) {
      console.error('Failed to delete table:', err);
      setError(err.response?.data?.message || 'Failed to delete table.');
    } finally {
      setDeletingId(null);
    }
  };

  const activeTable = selectedTable.toUpperCase();

  // Construct table menu URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const targetUrl = activeTable ? `${origin}/menu?table=${encodeURIComponent(activeTable)}` : '';

  // Download QR Code as high-res branded PNG image
  const handleDownloadPNG = () => {
    if (!qrRef.current || !activeTable) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    // Create a styled canvas with Cafe branding and table label for printing
    const printCanvas = document.createElement('canvas');
    const ctx = printCanvas.getContext('2d');
    const width = 420;
    const height = 540;

    printCanvas.width = width;
    printCanvas.height = height;

    // Background
    ctx.fillStyle = '#faf7f2';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#ebdccd';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // Cafe Name Header
    ctx.fillStyle = '#2e1c14';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Recharge Café', width / 2, 55);

    ctx.fillStyle = '#8c6b53';
    ctx.font = '12px sans-serif';
    ctx.fillText('SCAN TO VIEW MENU & ORDER', width / 2, 80);

    // Draw the QR Code centered
    const qrSize = 270;
    const qrX = (width - qrSize) / 2;
    const qrY = 105;
    ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize);

    // Table Label
    ctx.fillStyle = '#b23b14';
    ctx.font = 'bold 28px serif';
    ctx.fillText(`TABLE ${activeTable}`, width / 2, 420);

    // Subtext
    ctx.fillStyle = '#6e5444';
    ctx.font = '12px sans-serif';
    ctx.fillText('Freshly prepared table service', width / 2, 450);

    ctx.fillStyle = '#a68c78';
    ctx.font = '10px monospace';
    ctx.fillText(targetUrl, width / 2, 495);

    // Trigger download
    const url = printCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `recharge-cafe-table-${activeTable}-qr.png`;
    link.href = url;
    link.click();
  };

  const handleCopyLink = () => {
    if (!targetUrl) return;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#ebdccd] shadow-sm p-6 sm:p-8 text-[#2e1c14] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f4ebe1] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ebe1] text-[#b23b14] text-xs font-semibold mb-2">
            <QrCode className="w-3.5 h-3.5" />
            <span>Custom Dine-In Table Management</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#2e1c14]">
            Table QR Code Generator
          </h2>
          <p className="text-xs sm:text-sm text-[#7d5f4c] mt-1">
            Add custom cafe tables and generate high-resolution QR codes mapped to each table.
          </p>
        </div>

        {activeTable && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#8c6b53]">Selected Table:</span>
            <span className="px-3.5 py-1 rounded-full bg-[#b23b14] text-white font-mono font-bold text-sm shadow-sm">
              {activeTable}
            </span>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs font-bold text-rose-900 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Add Table Form & Only-Added Tables Grid */}
        <div className="lg:col-span-7 space-y-6">
          {/* Add Custom Table Card */}
          <div className="p-5 rounded-2xl bg-[#faf7f2] border border-[#ebdccd] space-y-3">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#b23b14]" />
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#2e1c14]">
                Add New Table
              </h3>
            </div>

            <form onSubmit={handleAddTable} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                placeholder="Enter Table Identifier (e.g. T01, Bar-1, Patio-2)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-[#e5d5c5] text-xs sm:text-sm font-mono font-bold text-[#2e1c14] placeholder-[#a68c78] focus:outline-none focus:ring-2 focus:ring-[#b23b14]/40 uppercase"
                required
              />

              <button
                type="submit"
                disabled={isAdding || !newTableNumber.trim()}
                className="py-2.5 px-6 rounded-xl bg-[#b23b14] hover:bg-[#962e0b] active:scale-[0.99] text-white font-bold text-xs sm:text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Table</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Only-Added Tables List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-[#4a3325] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#b23b14]" />
                <span>Added Tables ({tables.length})</span>
              </label>
              <span className="text-[11px] text-[#8c6b53]">
                Click table to generate QR code
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center bg-[#faf7f2] rounded-2xl border border-[#ebdccd]">
                <Loader2 className="w-6 h-6 animate-spin text-[#b23b14] mx-auto mb-2" />
                <p className="text-xs text-[#7d5f4c]">Loading registered tables...</p>
              </div>
            ) : tables.length === 0 ? (
              <div className="p-8 text-center bg-[#faf7f2] rounded-2xl border border-dashed border-[#d8c3b0]">
                <MapPin className="w-8 h-8 text-[#b23b14]/50 mx-auto mb-2" />
                <h4 className="font-serif font-bold text-sm text-[#2e1c14] mb-1">
                  No Tables Added Yet
                </h4>
                <p className="text-xs text-[#7d5f4c] max-w-sm mx-auto">
                  Add your tables using the field above. Only the tables you enter will be displayed here and have QR codes generated.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {tables.map((table) => {
                  const isSelected = selectedTable === table.tableNumber;
                  const isDeleting = deletingId === table._id;
                  return (
                    <div
                      key={table._id}
                      onClick={() => setSelectedTable(table.tableNumber)}
                      className={`relative p-3 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#b23b14] text-white border-[#b23b14] shadow-md shadow-[#b23b14]/25 scale-[1.02]'
                          : 'bg-[#faf7f2] text-[#2e1c14] border-[#ebdccd] hover:border-[#b23b14]/40 hover:bg-white'
                      }`}
                    >
                      <span
                        className={`font-mono font-black text-sm tracking-wide ${
                          isSelected ? 'text-white' : 'text-[#2e1c14]'
                        }`}
                      >
                        {table.tableNumber}
                      </span>

                      {/* Delete Table Action */}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteTable(table._id, table.tableNumber, e)}
                        disabled={isDeleting}
                        title={`Delete table ${table.tableNumber}`}
                        className={`p-1.5 rounded-lg transition ${
                          isSelected
                            ? 'hover:bg-white/20 text-white'
                            : 'hover:bg-rose-50 text-stone-400 hover:text-rose-600'
                        }`}
                      >
                        {isDeleting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Target URL Preview */}
          {activeTable && (
            <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#ebdccd] space-y-2">
              <span className="text-[11px] font-semibold text-[#8c6b53] uppercase tracking-wider block">
                Encoded Table Menu Destination
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={targetUrl}
                  className="flex-1 bg-white px-3 py-2 rounded-xl border border-[#e5d5c5] text-xs font-mono text-[#4a3325] truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="p-2 bg-white hover:bg-[#f4ebe1] rounded-xl border border-[#e5d5c5] text-[#4a3325] transition cursor-pointer"
                  title="Copy link"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-[#2e1c14] hover:bg-[#b23b14] text-white rounded-xl transition cursor-pointer"
                  title="Test live link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: QR Code Display Card & Download */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {activeTable ? (
            <>
              <div
                ref={qrRef}
                className="p-6 bg-[#faf7f2] rounded-3xl border-2 border-[#ebdccd] shadow-md flex flex-col items-center text-center w-full max-w-[280px]"
              >
                <img
                  src="/logo.png"
                  alt="Recharge Café"
                  className="w-12 h-12 rounded-full mb-1 border border-[#ebdccd]"
                />
                <span className="font-serif font-bold text-lg text-[#2e1c14] mb-1">
                  Recharge Café
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#8c6b53] mb-4">
                  Scan to Dine In
                </span>

                {/* QR Canvas */}
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-[#e5d5c5]">
                  <QRCodeCanvas
                    value={targetUrl}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#2e1c14"
                    level="H"
                    includeMargin={false}
                  />
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#b23b14] text-white text-xs font-bold shadow-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>TABLE {activeTable}</span>
                </div>
              </div>

              {/* Download PNG Button */}
              <button
                onClick={handleDownloadPNG}
                type="button"
                className="w-full max-w-[280px] mt-4 py-3 px-4 rounded-full bg-[#b23b14] hover:bg-[#962e0b] text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#b23b14]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Table PNG Card</span>
              </button>
            </>
          ) : (
            <div className="w-full max-w-[280px] p-8 text-center bg-[#faf7f2] rounded-3xl border-2 border-dashed border-[#ebdccd]">
              <QrCode className="w-12 h-12 text-[#b23b14]/30 mx-auto mb-3" />
              <h4 className="font-serif font-bold text-sm text-[#2e1c14] mb-1">
                No Table Selected
              </h4>
              <p className="text-xs text-[#7d5f4c]">
                Add a table on the left to generate its printable QR code card.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
