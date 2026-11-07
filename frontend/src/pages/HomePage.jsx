import React, { useState, useEffect } from 'react';
import { Coffee, CheckCircle, Server } from 'lucide-react';
import api from '../services/api';

const HomePage = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await api.get('/health');
        setHealthStatus(response.data);
      } catch (error) {
        setHealthStatus({ status: 'OFFLINE', error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
            <Coffee className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Cafe Ordering System</h1>
            <p className="text-sm text-slate-500">MERN Stack - Task 1 Base Initialized</p>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">Backend Integration Status</h2>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200">
            <Server className="w-5 h-5 text-slate-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">Health Endpoint: <span className="font-mono text-xs bg-slate-200 px-1.5 py-0.5 rounded">GET /api/health</span></p>
              {loading ? (
                <p className="text-xs text-slate-400 mt-1">Connecting to backend...</p>
              ) : (
                <p className="text-xs mt-1">
                  Status:{' '}
                  <span className={`font-semibold ${healthStatus?.status === 'OK' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {healthStatus?.status || 'Unknown'}
                  </span>
                  {healthStatus?.message && ` - ${healthStatus.message}`}
                </p>
              )}
            </div>
            {!loading && healthStatus?.status === 'OK' && (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

