import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

/* ── SVG Icon Helpers ── */
const IconEyeOpen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeClosed = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconDot = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const IconAlert = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ── Email Validation ── */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

/* ── Password Strength Engine ── */
const getPasswordStrength = (password) => {
  const checks = {
    hasMinLength:   password.length >= 8,
    hasUppercase:   /[A-Z]/.test(password),
    hasLowercase:   /[a-z]/.test(password),
    hasNumber:      /\d/.test(password),
    hasSpecial:     /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;

  let level = '';
  let label = '';
  let barsActive = 0;

  if (password.length === 0) {
    level = '';
    label = '';
    barsActive = 0;
  } else if (score <= 2) {
    level = 'weak';
    label = 'Weak';
    barsActive = 1;
  } else if (score === 3) {
    level = 'fair';
    label = 'Fair';
    barsActive = 2;
  } else if (score === 4) {
    level = 'medium';
    label = 'Medium';
    barsActive = 3;
  } else {
    level = 'strong';
    label = 'Strong';
    barsActive = 4;
  }

  return { checks, score, level, label, barsActive };
};

/* ══════════════════════════════════════════
   Auth Component (Login & Sign Up)
══════════════════════════════════════════ */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  /* ── State ── */
  const [mode, setMode]                   = useState('signin'); // 'signin' | 'signup'
  const [name, setName]                   = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading]             = useState(false);

  const [authError, setAuthError]         = useState('');
  const [errors, setErrors]               = useState({});
  const [touched, setTouched]             = useState({});

  /* ── Derived: password strength ── */
  const strength = getPasswordStrength(password);

  /* ── Switch Mode (Reset State) ── */
  const handleSwitchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setAuthError('');
    setErrors({});
    setTouched({});
  };

  /* ── Validate Fields ── */
  const validate = () => {
    const newErrors = {};

    if (mode === 'signup') {
      if (!name.trim()) {
        newErrors.name = 'Full name is required.';
      }
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (mode === 'signup' && password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (mode === 'signup') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password.';
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    return newErrors;
  };

  /* ── Real-time Validation on Blur ── */
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const current = validate();
    setErrors((prev) => ({ ...prev, [field]: current[field] }));
  };

  /* ── Form Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    const allTouched = mode === 'signup'
      ? { name: true, email: true, password: true, confirmPassword: true }
      : { email: true, password: true };

    setTouched(allTouched);

    const validationErrors = validate();
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((msg) => !!msg);
    if (hasErrors) return;

    setLoading(true);
    try {
      if (mode === 'signup') {
        const res = await registerUser(name, email, password);
        login(res.user);
        navigate('/dashboard');
      } else {
        const res = await loginUser(email, password);
        login(res.user);
        navigate('/dashboard');
      }
    } catch (err) {

      setAuthError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Strength Bar Class ── */
  const strengthBarClass = (index) => {
    if (strength.barsActive > index) {
      return `strength-bar active-${strength.level}`;
    }
    return 'strength-bar';
  };

  return (
    <main className="login-page">
      <div className="login-split-container">
        
        {/* Left Branding / Hero Side Panel (Desktop Split View) */}
        <div className="login-hero-panel">
          <div className="hero-brand">
            <div className="hero-logo-box" aria-hidden="true">
              <svg className="hero-logo-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="hero-brand-text">
              <span className="hero-brand-name">Codlix Technologies</span>
              <span className="hero-brand-tag">Enterprise Inventory System</span>
            </div>
          </div>

          <div className="hero-content">
            <h2 className="hero-headline">Intelligent Inventory &amp; Vendor Management</h2>
            <p className="hero-subtext">
              Real-time stock monitoring, automated multi-warehouse tracking, and end-to-end supply chain visibility built for scale.
            </p>

            <div className="hero-features">
              <div className="hero-feature-card">
                <div className="hero-feature-icon">⚡</div>
                <div>
                  <h4 className="hero-feature-title">Real-Time Stock Analytics</h4>
                  <p className="hero-feature-desc">Monitor total, available, reserved, and damaged inventory across all locations.</p>
                </div>
              </div>

              <div className="hero-feature-card">
                <div className="hero-feature-icon">🛡️</div>
                <div>
                  <h4 className="hero-feature-title">Automated Reorder Alerts</h4>
                  <p className="hero-feature-desc">Prevent stockouts with instant alerts when items drop below reorder thresholds.</p>
                </div>
              </div>

              <div className="hero-feature-card">
                <div className="hero-feature-icon">🔒</div>
                <div>
                  <h4 className="hero-feature-title">Enterprise Security</h4>
                  <p className="hero-feature-desc">Role-based access control with complete audit trail for stock adjustments &amp; transfers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-footer">
            <span>Codlix Suite v2.4 • Enterprise SaaS Platform</span>
          </div>
        </div>

        {/* Right Auth Card Panel */}
        <div className="login-card" role="main">

          {/* Header */}
          <header className="login-header">
            <div className="login-logo-wrapper" aria-hidden="true">
              <svg className="login-logo-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h1 className="login-title">Inventory &amp; Vendor Management</h1>
            <p className="login-subtitle">
              {mode === 'signin'
                ? 'Sign in to your account to continue'
                : 'Create a new account to get started'}
            </p>
          </header>

          {/* Tab Switcher */}
          <div className="auth-tabs" role="tablist" aria-label="Authentication Options">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signin'}
              className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
              onClick={() => handleSwitchMode('signin')}
              disabled={loading}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => handleSwitchMode('signup')}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>

          <div className="login-divider" aria-hidden="true" />

          {/* Top Error Alert Banner */}
          {authError && (
            <div className="auth-alert-banner" role="alert">
              <IconAlert />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} noValidate>

            {/* ── Full Name Field (Sign Up mode only) ── */}
            {mode === 'signup' && (
              <div className="field-group">
                <label className="field-label" htmlFor="name">
                  Full Name <span className="required-star" aria-hidden="true">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className={`field-input${touched.name && errors.name ? ' input-error' : ''}`}
                    placeholder="John Doe"
                    value={name}
                    autoComplete="name"
                    aria-required="true"
                    aria-describedby={touched.name && errors.name ? 'name-error' : undefined}
                    aria-invalid={touched.name && !!errors.name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur('name')}
                    disabled={loading}
                  />
                </div>
                {touched.name && errors.name && (
                  <p className="field-error" id="name-error" role="alert">
                    <IconAlert />
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* ── Email Field ── */}
            <div className="field-group">
              <label className="field-label" htmlFor="email">
                Email ID <span className="required-star" aria-hidden="true">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  name="email"
                  className={`field-input${touched.email && errors.email ? ' input-error' : ''}`}
                  placeholder="you@company.com"
                  value={email}
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
                  aria-invalid={touched.email && !!errors.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  onBlur={() => handleBlur('email')}
                  disabled={loading}
                />
              </div>
              {touched.email && errors.email && (
                <p className="field-error" id="email-error" role="alert">
                  <IconAlert />
                  {errors.email}
                </p>
              )}
            </div>

            {/* ── Password Field ── */}
            <div className="field-group">
              <label className="field-label" htmlFor="password">
                Password <span className="required-star" aria-hidden="true">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`field-input input-password${touched.password && errors.password ? ' input-error' : ''}`}
                  placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                  value={password}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  aria-required="true"
                  aria-describedby={
                    touched.password && errors.password
                      ? 'password-error'
                      : password
                      ? 'password-strength'
                      : undefined
                  }
                  aria-invalid={touched.password && !!errors.password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  onBlur={() => handleBlur('password')}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                  disabled={loading}
                >
                  {showPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                </button>
              </div>

              {/* Password error */}
              {touched.password && errors.password && (
                <p className="field-error" id="password-error" role="alert">
                  <IconAlert />
                  {errors.password}
                </p>
              )}

              {/* Password strength indicator (shown when typing in Sign Up mode only) */}
              {mode === 'signup' && password.length > 0 && (
                <div
                  className="password-strength-wrapper"
                  id="password-strength"
                  aria-live="polite"
                  aria-label={`Password strength: ${strength.label}`}
                >
                  <div className="strength-bars" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={strengthBarClass(i)} />
                    ))}
                  </div>

                  <div className="strength-label-row">
                    <span className={`strength-text ${strength.level}`}>
                      {strength.label} password
                    </span>
                  </div>

                  <ul className="password-requirements" aria-label="Password requirements">
                    <RequirementItem met={strength.checks.hasMinLength}>
                      At least 8 characters
                    </RequirementItem>
                    <RequirementItem met={strength.checks.hasUppercase}>
                      At least one uppercase letter (A–Z)
                    </RequirementItem>
                    <RequirementItem met={strength.checks.hasLowercase}>
                      At least one lowercase letter (a–z)
                    </RequirementItem>
                    <RequirementItem met={strength.checks.hasNumber}>
                      At least one number (0–9)
                    </RequirementItem>
                    <RequirementItem met={strength.checks.hasSpecial}>
                      At least one special character (!@#$…)
                    </RequirementItem>
                  </ul>
                </div>
              )}
            </div>

            {/* ── Confirm Password Field (Sign Up mode only) ── */}
            {mode === 'signup' && (
              <div className="field-group">
                <label className="field-label" htmlFor="confirmPassword">
                  Confirm Password <span className="required-star" aria-hidden="true">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`field-input input-password${touched.confirmPassword && errors.confirmPassword ? ' input-error' : ''}`}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    autoComplete="new-password"
                    aria-required="true"
                    aria-describedby={touched.confirmPassword && errors.confirmPassword ? 'confirm-password-error' : undefined}
                    aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    tabIndex={0}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <IconEyeClosed /> : <IconEyeOpen />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="field-error" id="confirm-password-error" role="alert">
                    <IconAlert />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* ── Submit Button ── */}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
              aria-busy={loading}
              aria-label={
                loading
                  ? mode === 'signup' ? 'Creating account...' : 'Logging in...'
                  : mode === 'signup' ? 'Create Account' : 'Sign In'
              }
            >
              {loading ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                mode === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Mode Switch Prompt */}
          <div className="auth-switch-prompt">
            {mode === 'signin' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => handleSwitchMode('signup')}
                  disabled={loading}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => handleSwitchMode('signin')}
                  disabled={loading}
                >
                  Sign In
                </button>
              </p>
            )}
          </div>

          {/* Footer */}
          <footer className="login-footer">
            <p>© {new Date().getFullYear()} Codlix Technologies. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </main>
  );

};

/* ── Requirement Item Sub-Component ── */
const RequirementItem = ({ met, children }) => (
  <li className={`requirement-item${met ? ' met' : ''}`}>
    {met ? <IconCheck /> : <IconDot />}
    <span>{children}</span>
  </li>
);

export default Login;

