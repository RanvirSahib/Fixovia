import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search services, workers, or areas…' }) {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch && onSearch(query.trim());
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 16px',
      background: 'var(--white)',
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius-full)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'var(--transition)',
    }}
    onFocus={(e) => {
      e.currentTarget.style.borderColor = 'var(--primary)';
      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(225,29,72,0.08)';
    }}
    onBlur={(e) => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    }}
    >
      <span style={{ color: 'var(--muted)', fontSize: 16 }}>🔍</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          fontSize: 14,
          color: 'var(--charcoal)',
          background: 'none',
          fontFamily: 'var(--font)',
        }}
      />
      {query && (
        <button
          onClick={() => { setQuery(''); onSearch && onSearch(''); }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--muted)',
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
