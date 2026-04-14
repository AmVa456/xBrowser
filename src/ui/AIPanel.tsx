import React, { useState } from 'react';
import { getActiveProvider } from '../ai/providerRegistry';

export const AIPanel: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const provider = getActiveProvider();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await provider.complete(input);
      setResponse(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        borderRadius: '16px',
        padding: '16px 18px',
        backgroundImage: 'var(--xb-gradient)',
        color: 'var(--xb-bg)',
        boxShadow: '0 18px 45px rgba(0,0,0,0.6)'
      }}
    >
      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600 }}>AI Panel · {provider.name}</span>
        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>xBrowser · xSeries</span>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          style={{
            flex: 1,
            borderRadius: '999px',
            border: 'none',
            padding: '8px 12px',
            fontFamily: 'var(--xb-font)',
            fontSize: '0.9rem'
          }}
          placeholder="Ask xBrowser something..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            borderRadius: '999px',
            border: 'none',
            padding: '8px 14px',
            fontFamily: 'var(--xb-font)',
            fontSize: '0.9rem',
            background: '#0A0A0A',
            color: 'var(--xb-accent-white)',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Thinking…' : 'Send'}
        </button>
      </form>
      {response && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 12px',
            borderRadius: '12px',
            background: 'rgba(10,10,10,0.85)',
            color: 'var(--xb-accent-white)',
            fontSize: '0.9rem'
          }}
        >
          {response}
        </div>
      )}
    </div>
  );
};
