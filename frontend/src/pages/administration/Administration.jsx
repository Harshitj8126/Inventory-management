/* ============================================================
   Administration.jsx — System Administration Page with Interactivity
   Codlix Technologies · Inventory & Vendor Management System
   ============================================================ */

import { useState } from 'react';
import { usersData as initialUsers, warehousesData } from '../../services/mockData';
import Modal from '../../components/modals/Modal';
import './Administration.css';

/* ── Icons ── */
const IconSettings = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconWarehouse = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IconServer = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const getInitials = (name) => name ? name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() : 'U';

const roleClass = (role) => {
  const m = { Admin: 'admin', Manager: 'manager', Staff: 'staff', Viewer: 'viewer' };
  return `adm-role-badge adm-role--${m[role] || 'viewer'}`;
};

const Administration = () => {
  const [users, setUsers] = useState(initialUsers);

  /* Modals */
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  /* Form */
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Manager',
    warehouse: 'Main Warehouse - Mumbai',
  });

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const created = {
      id: `USR-00${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      lastLogin: 'Just Now',
      warehouses: [newUser.warehouse.split(' - ')[0]],
    };

    setUsers([created, ...users]);
    setIsInviteModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Manager', warehouse: 'Main Warehouse - Mumbai' });
  };

  const handleSaveEditUser = () => {
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    setSelectedUser(null);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    setSelectedUser(null);
  };

  return (
    <div className="adm-page">

      {/* ── Header ── */}
      <div className="adm-header">
        <div className="adm-header-text">
          <div className="adm-icon-wrap" aria-hidden="true"><IconSettings /></div>
          <h1 className="adm-page-title">System Administration</h1>
          <p className="adm-page-subtitle">Manage users, warehouses, roles, and system configuration</p>
        </div>
        <button
          type="button"
          className="adm-btn-invite"
          onClick={() => setIsInviteModalOpen(true)}
          aria-label="Invite new user"
        >
          <IconPlus /> Invite User
        </button>
      </div>

      {/* ── Main Grid ── */}
      <div className="adm-grid">

        {/* ── User Management (full width) ── */}
        <div className="adm-card adm-card-full">
          <div className="adm-card-header">
            <div>
              <div className="adm-card-title">User Management</div>
              <div className="adm-card-sub">Control access roles and permissions</div>
            </div>
            <span className="adm-badge">{users.length} Users</span>
          </div>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', overscrollBehaviorX: 'contain' }}>
            <table className="adm-user-table" aria-label="User management table">
              <thead>
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="adm-col-last">Last Login</th>
                  <th scope="col" className="adm-col-wh">Warehouses</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div className="adm-user-cell">
                        <div className="adm-user-avatar" aria-hidden="true">{getInitials(u.name)}</div>
                        <div>
                          <div className="adm-user-name">{u.name}</div>
                          <div className="adm-user-email">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className={roleClass(u.role)}>{u.role}</span></td>
                    <td>
                      <span
                        className={`adm-status-dot adm-status-dot--${u.status.toLowerCase()}`}
                        role="img"
                        aria-label={u.status}
                        title={u.status}
                      />
                      {' '}{u.status}
                    </td>
                    <td className="adm-col-last" style={{ color: '#64748b', fontSize: '0.85rem' }}>{u.lastLogin}</td>
                    <td className="adm-col-wh" style={{ fontSize: '0.82rem', color: '#64748b' }}>{u.warehouses.join(', ')}</td>
                    <td>
                      <button
                        type="button"
                        className="adm-action-btn"
                        onClick={() => setSelectedUser(u)}
                        aria-label={`Edit ${u.name}`}
                      >
                        <IconEdit /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Warehouses ── */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <div className="adm-card-title">Warehouses</div>
              <div className="adm-card-sub">Capacity and manager info</div>
            </div>
            <span className="adm-badge">{warehousesData.length} Sites</span>
          </div>
          <div className="adm-wh-list" role="list" aria-label="Warehouse list">
            {warehousesData.map(wh => {
              const pct = Math.round((wh.used / wh.capacity) * 100);
              return (
                <div key={wh.id} className="adm-wh-card" role="listitem" aria-label={wh.name}>
                  <div className="adm-wh-top">
                    <div>
                      <div className="adm-wh-name">
                        <span style={{ marginRight: 8 }}><IconWarehouse /></span>
                        {wh.name}
                      </div>
                      <div className="adm-wh-city">{wh.city}</div>
                      <div className="adm-wh-manager">Manager: {wh.manager}</div>
                    </div>
                    <span
                      style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', flexShrink: 0 }}
                    >{wh.status}</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: 6 }}>
                      <span>Capacity utilization</span>
                      <span style={{ fontWeight: 700, color: pct > 80 ? '#dc2626' : '#1e293b' }}>{pct}%</span>
                    </div>
                    <div className="adm-wh-track" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
                      <div className="adm-wh-fill" style={{ width: `${pct}%`, background: pct > 80 ? 'linear-gradient(90deg,#ef4444,#dc2626)' : pct > 60 ? 'linear-gradient(90deg,#f59e0b,#d97706)' : 'linear-gradient(90deg,#334155,#475569)' }} />
                    </div>
                    <div className="adm-wh-meta" style={{ marginTop: 6 }}>
                      <span>{wh.used.toLocaleString()} used</span>
                      <span>{wh.capacity.toLocaleString()} total capacity</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── System Info ── */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div>
              <div className="adm-card-title">System Information</div>
              <div className="adm-card-sub">Platform status and version details</div>
            </div>
            <IconServer />
          </div>
          <div className="adm-system-grid" role="list" aria-label="System information">
            {[
              { label: 'Platform',       value: 'Codlix IMS v2.4',       cls: '' },
              { label: 'Environment',    value: 'Production',             cls: 'adm-sys-value--blue' },
              { label: 'Status',         value: '● Live & Operational',  cls: 'adm-sys-value--green' },
              { label: 'Last Deploy',    value: 'Sep 16, 2026',          cls: '' },
              { label: 'Active Users',   value: `${users.filter(u => u.status === 'Active').length} / ${users.length}`, cls: '' },
              { label: 'Total Warehouses', value: `${warehousesData.length} Sites`, cls: '' },
              { label: 'Data Backup',    value: 'Daily at 02:00 IST',    cls: '' },
              { label: 'API Version',    value: 'v1.0 (REST)',           cls: '' },
            ].map((s, i) => (
              <div key={i} className="adm-sys-item" role="listitem">
                <span className="adm-sys-label">{s.label}</span>
                <span className={`adm-sys-value ${s.cls}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── MODAL: Invite User ── */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
        subtitle="Grant access to team members with specific roles"
        icon={<IconPlus />}
        iconClass="modal-header-icon--slate"
        size="md"
        footer={
          <div className="modal-actions-right">
            <button type="button" className="btn-modal btn-modal-secondary" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="invite-user-form" className="btn-modal btn-modal-primary" style={{ background: '#334155' }}>
              Send Invitation
            </button>
          </div>
        }
      >
        <form id="invite-user-form" onSubmit={handleInviteSubmit} className="modal-form-grid">
          <div className="modal-form-group modal-col-12">
            <label className="modal-label" htmlFor="usr-name">Full Name *</label>
            <input
              id="usr-name"
              type="text"
              required
              className="modal-input"
              placeholder="e.g. Vikramaditya Singh"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-12">
            <label className="modal-label" htmlFor="usr-email">Email Address *</label>
            <input
              id="usr-email"
              type="email"
              required
              className="modal-input"
              placeholder="vikram@codlix.com"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="usr-role">Access Role</label>
            <select
              id="usr-role"
              className="modal-select"
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Staff</option>
              <option>Viewer</option>
            </select>
          </div>

          <div className="modal-form-group modal-col-6">
            <label className="modal-label" htmlFor="usr-wh">Assigned Warehouse</label>
            <select
              id="usr-wh"
              className="modal-select"
              value={newUser.warehouse}
              onChange={e => setNewUser({ ...newUser, warehouse: e.target.value })}
            >
              <option>Main Warehouse - Mumbai</option>
              <option>North Hub - Delhi NCR</option>
              <option>South Logistics Hub - Bengaluru</option>
              <option>Western Fulfillment Center - Surat</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: Edit User ── */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Edit Permissions: ${selectedUser.name}`}
          subtitle={`User ID: ${selectedUser.id} · ${selectedUser.email}`}
          icon={<IconSettings />}
          iconClass="modal-header-icon--slate"
          size="md"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-modal btn-modal-danger"
                onClick={() => handleDeleteUser(selectedUser.id)}
              >
                Remove User
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-modal btn-modal-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-modal btn-modal-primary"
                  style={{ background: '#0f172a' }}
                  onClick={handleSaveEditUser}
                >
                  Save Changes
                </button>
              </div>
            </div>
          }
        >
          <div className="modal-form-grid">
            <div className="modal-form-group modal-col-6">
              <label className="modal-label">User Role</label>
              <select
                className="modal-select"
                value={selectedUser.role}
                onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                <option>Admin</option>
                <option>Manager</option>
                <option>Staff</option>
                <option>Viewer</option>
              </select>
            </div>

            <div className="modal-form-group modal-col-6">
              <label className="modal-label">Account Status</label>
              <select
                className="modal-select"
                value={selectedUser.status}
                onChange={e => setSelectedUser({ ...selectedUser, status: e.target.value })}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="modal-form-group modal-col-12">
              <label className="modal-label">Assigned Warehouses</label>
              <div style={{ fontSize: '0.85rem', color: '#475569', padding: '10px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                {selectedUser.warehouses ? selectedUser.warehouses.join(', ') : 'All Sites'}
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default Administration;
