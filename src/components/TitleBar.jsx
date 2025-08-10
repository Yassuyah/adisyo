// src/components/TitleBar.jsx
import React from 'react';

export default function TitleBar() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '4px 8px',
        background: '#222',
        WebkitAppRegion: 'drag'         // frameless sürükleyebilmek için
      }}
    >
      <button
        onClick={() => window.api.minimizeApp()}
        style={{
          width: '36px',
          height: '36px',
          fontSize: '20px',
          marginRight: '8px',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          WebkitAppRegion: 'no-drag'     // butonların tıklanabilir olması için
        }}
      >
        ─
      </button>
      <button
        onClick={() => window.api.closeApp()}
        style={{
          width: '36px',
          height: '36px',
          fontSize: '20px',
          background: 'transparent',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          WebkitAppRegion: 'no-drag'
        }}
      >
        ✕
      </button>
    </div>
  );
}