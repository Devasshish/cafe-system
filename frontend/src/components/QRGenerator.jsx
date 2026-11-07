import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, ExternalLink, QrCode, Copy, Check, Sparkles, MapPin } from 'lucide-react';

const PRESET_TABLES = ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12'];

const QRGenerator = () => {
  const [selectedTable, setSelectedTable] = useState('T01');
  const [customTable, setCustomTable] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  const activeTable = (customTable.trim() || selectedTable).toUpperCase();

  // Construct table menu URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const targetUrl = `${origin}/menu?table=${encodeURIComponent(activeTable)}`;

  // Download QR Code as high-res PNG image
  const handleDownloadPNG = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;

    // Create a styled canvas with Cafe branding and table label for printing
    const printCanvas = document.createElement('canvas');
    const ctx = printCanvas.getContext('2d');
    const width = 400;
    const height = 520;

    printCanvas.width = width;
    printCanvas.height = height;

    // Background
    ctx.fillStyle = '#faf7f2';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#ebdccd';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Cafe Name Header
    ctx.fillStyle = '#2e1c14';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText('Cafe Royale', width / 2, 55);

    ctx.fillStyle = '#8c6b53';
    ctx.font = '12px sans-serif';
    ctx.fillText('SCAN TO VIEW MENU & ORDER', width / 2, 80);

    // Draw the QR Code centered
    const qrSize = 260;
    const qrX = (width - qrSize) / 2;
    const qrY = 105;
    ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize);

    // Table Label
    ctx.fillStyle = '#c86227';
    ctx.font = 'bold 26px serif';
    ctx.fillText(`TABLE ${activeTable}`, width / 2, 410);

    // Subtext
    ctx.fillStyle = '#6e5444';
    ctx.font = '12px sans-serif';
    ctx.fillText('Freshly prepared table service', width / 2, 440);

    ctx.fillStyle = '#a68c78';
    ctx.font = '10px monospace';
    ctx.fillText(targetUrl, width / 2, 485);

    // Trigger download
    const url = printCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `cafe-royale-table-${activeTable}-qr.png`;
    link.href = url;
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#ebdccd] shadow-sm p-6 sm:p-8 text-[#2e1c14] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f4ebe1] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ebe1] text-[#c86227] text-xs font-semibold mb-2">
            <QrCode className="w-3.5 h-3.5" />
            <span>Table Dine-In Identification</span>
          </div>
          <h2 className="font-serif font-bold text-2xl text-[#2e1c14]">
            Table QR Code Generator
          </h2>
          <p className="text-xs sm:text-sm text-[#7d5f4c] mt-1">
            Generate printable, high-resolution QR codes mapped to individual cafe tables.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8c6b53]">Active Table:</span>
          <span className="px-3 py-1 rounded-full bg-[#c86227] text-white font-mono font-bold text-sm">
            {activeTable}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Table Selector Controls */}
        <div className="lg:col-span-7 space-y-5">
          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-[#4a3325] uppercase tracking-wider mb-2.5">
              Select Preset Table Number
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {PRESET_TABLES.map((table) => {
                const isSelected = selectedTable === table && !customTable.trim();
                return (
                  <button
                    key={table}
                    type="button"
                    onClick={() => {
                      setSelectedTable(table);
                      setCustomTable('');
                    }}
                    className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#c86227] text-white shadow-md shadow-[#c86227]/25 scale-102'
                        : 'bg-[#faf7f2] text-[#4a3325] border border-[#e5d5c5] hover:border-[#c86227] hover:bg-white'
                    }`}
                  >
                    {table}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Table Input */}
          <div>
            <label className="block text-xs font-semibold text-[#4a3325] uppercase tracking-wider mb-2">
              Or Enter Custom Table Identifier
            </label>
            <input
              type="text"
              value={customTable}
              onChange={(e) => setCustomTable(e.target.value)}
              placeholder="e.g. Bar-1, Patio-4, VIP-A"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#e5d5c5] text-sm text-[#2e1c14] placeholder-[#a68c78] focus:outline-none focus:ring-2 focus:ring-[#c86227]/40 uppercase"
            />
          </div>

          {/* Target URL Preview */}
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
                className="p-2 bg-white hover:bg-[#f4ebe1] rounded-xl border border-[#e5d5c5] text-[#4a3325] transition"
                title="Copy link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              <a
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[#2e1c14] hover:bg-[#c86227] text-white rounded-xl transition"
                title="Test live link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: QR Code Display Card & Download */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            ref={qrRef}
            className="p-6 bg-[#faf7f2] rounded-3xl border-2 border-[#ebdccd] shadow-md flex flex-col items-center text-center w-full max-w-[280px]"
          >
            <span className="font-serif font-bold text-lg text-[#2e1c14] mb-1">
              Cafe Royale
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

            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c86227] text-white text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>TABLE {activeTable}</span>
            </div>
          </div>

          {/* Download PNG Button */}
          <button
            onClick={handleDownloadPNG}
            type="button"
            className="w-full max-w-[280px] mt-4 py-3 px-4 rounded-full bg-[#c86227] hover:bg-[#b0531e] text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#c86227]/25 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Table PNG Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
