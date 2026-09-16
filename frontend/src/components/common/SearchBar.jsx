/* ============================================================
   SearchBar.jsx — Reusable Controlled Search Input
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

/**
 * SearchBar
 *
 * A controlled, accessible search input component.
 *
 * Props:
 *   id          {string}   — unique id for input (links label to input)
 *   label       {string}   — accessible label text (visually hidden via .sr-only)
 *   value       {string}   — controlled input value
 *   onChange    {function} — onChange handler (receives event)
 *   placeholder {string}   — placeholder text
 */
const SearchBar = ({ id, label, value, onChange, placeholder }) => {
  return (
    <div className="search-bar-wrapper">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      {/* Search Icon */}
      <span className="search-bar-icon" aria-hidden="true">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>

      <input
        id={id}
        type="search"
        className="search-bar-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Search...'}
        autoComplete="off"
        aria-label={label}
      />

      {/* Clear button — shown when there is input */}
      {value && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={() => onChange({ target: { value: '' } })}
          aria-label="Clear search"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
