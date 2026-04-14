import React from 'react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { AIPanel } from './AIPanel';

export const App: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--xb-bg)',
        color: 'var(--xb-accent-white)',
        fontFamily: 'var(--xb-font)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          padding: '24px 32px',
          borderRadius: '16px',
          backgroundImage: 'var(--xb-gradient)',
          boxShadow: '0 18px 45px rgba(0,0,0,0.6)',
          maxWidth: '640px',
          width: '100%'
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>xBrowser</h1>
        <p style={{ marginTop: '0.75rem', opacity: 0.9 }}>
          AI-native browser shell · pastel gradients · trans-flag highlights · xSeries core.
        </p>
      </div>
    </div>
  );
};


