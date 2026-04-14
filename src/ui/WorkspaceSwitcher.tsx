import React, { useEffect, useState } from 'react';

export const WorkspaceSwitcher: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    fetch('/.xworkspace/index.json')
      .then(r => r.json())
      .then(list => setWorkspaces(list))
      .catch(() => setWorkspaces([]));
  }, []);

  const handleSelect = (ws: string) => {
    setActive(ws);
    localStorage.setItem('xBrowser.activeWorkspace', ws);
    window.location.reload();
  };

  return (
    <div style={{
      padding: '12px',
      borderRadius: '12px',
      background: 'rgba(255,255,255,0.08)',
      marginBottom: '1rem'
    }}>
      <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Workspace</h3>
      {workspaces.length === 0 && <p>No workspaces found.</p>}
      {workspaces.map(ws => (
        <button
          key={ws}
          onClick={() => handleSelect(ws)}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px 12px',
            marginBottom: '6px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            background: active === ws ? 'var(--xb-accent-blue)' : 'var(--xb-bg)',
            color: active === ws ? 'var(--xb-bg)' : 'var(--xb-accent-white)',
            fontFamily: 'var(--xb-font)'
          }}
        >
          {ws}
        </button>
      ))}
    </div>
  );
};
