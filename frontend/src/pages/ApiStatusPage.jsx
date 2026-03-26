import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Activity, Server, Zap } from 'lucide-react';
import { getHealth } from '../services/api';

export default function ApiStatusPage() {
  const [status, setStatus] = useState({
    connected: false,
    loading: true,
    error: null,
    data: null,
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await getHealth();
      setStatus({
        connected: true,
        loading: false,
        error: null,
        data,
      });
    } catch (error) {
      setStatus({
        connected: false,
        loading: false,
        error: error.message || 'Failed to connect',
        data: null,
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="page-wrap" style={{ padding: '40px 24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="section-title serif" style={{ marginBottom: '8px' }}>🔌 API Connection Status</h1>
      <p className="section-sub" style={{ marginBottom: '32px' }}>
        Check if the frontend is properly connected to the KrishiMitra AI backend
      </p>

      {/* Connection Status Card */}
      <div className="result-card" style={{ marginBottom: '24px' }}>
        <div className="result-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {status.connected ? (
              <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-success)' }} />
            ) : (
              <XCircle className="w-5 h-5" style={{ color: 'var(--color-red)' }} />
            )}
            <strong style={{ color: status.connected ? 'var(--color-success)' : 'var(--color-red)' }}>
              {status.connected ? 'Backend Connected' : 'Backend Not Connected'}
            </strong>
          </div>
          <button
            onClick={checkConnection}
            disabled={status.loading}
            style={{
              padding: '8px 16px',
              background: status.loading ? 'var(--color-muted)' : 'var(--color-gold)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: status.loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '12px',
            }}
          >
            {status.loading ? 'Checking...' : 'Refresh'}
          </button>
        </div>
        <div className="result-body">
          {status.error && (
            <div style={{ padding: '12px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#DC2626', marginBottom: '16px' }}>
              <strong>Error:</strong> {status.error}
            </div>
          )}
          
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#F0F7F2', borderRadius: '8px' }}>
              <Server className="w-5 h-5" style={{ color: 'var(--color-forest)' }} />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Backend URL</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>http://localhost:8001/api/v1</div>
              </div>
            </div>

            {status.data && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#EFF6FF', borderRadius: '8px' }}>
                  <Activity className="w-5 h-5" style={{ color: '#1E40AF' }} />
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-muted)', textTransform: 'uppercase' }}>Status</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>
                      {status.data.status?.toUpperCase()} - v{status.data.version}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#FEF3C7', borderRadius: '8px' }}>
                  <Zap className="w-5 h-5" style={{ color: '#92400E' }} />
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-muted)', textTransform: 'uppercase' }}>AI Agents Online</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text)' }}>
                      {status.data.agents_online?.length || 0} agents
                    </div>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Agents Available</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {status.data.agents_online?.map((agent, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '4px 10px',
                          background: '#F0F4F0',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: 'var(--color-sage)',
                        }}
                      >
                        {agent.replace('_agent', '').toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="result-card">
        <div className="result-body">
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--color-forest)', marginBottom: '16px' }}>
            Available Endpoints
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {[
              { method: 'GET', path: '/api/v1/health', desc: 'Health check' },
              { method: 'POST', path: '/api/v1/advisory', desc: 'Get farming advisory' },
              { method: 'POST', path: '/api/v1/advisory/with-photo', desc: 'Advisory with photo' },
              { method: 'GET', path: '/api/v1/schemes', desc: 'Government schemes' },
              { method: 'POST', path: '/api/v1/stt', desc: 'Speech to text' },
              { method: 'POST', path: '/api/v1/tts', desc: 'Text to speech' },
            ].map((endpoint, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  background: '#F9FAF9',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <span
                  style={{
                    padding: '3px 8px',
                    background: endpoint.method === 'GET' ? '#DBEAFE' : '#DCFCE7',
                    color: endpoint.method === 'GET' ? '#1E40AF' : '#166534',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '700',
                  }}
                >
                  {endpoint.method}
                </span>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-text)' }}>
                  {endpoint.path}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-muted)', marginLeft: 'auto' }}>
                  {endpoint.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
