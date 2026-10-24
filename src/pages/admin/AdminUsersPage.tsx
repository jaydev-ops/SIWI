import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AdminUser } from '../../types';
import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Trash2,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Active session operator
  const currentUser = JSON.parse(
    localStorage.getItem('siwi_admin_user') || '{"first_name": "Harshvardhan", "role": "SUPER_ADMIN"}'
  );

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newConfirmPassword, setNewConfirmPassword] = useState('');
  const [newRole, setNewRole] = useState<'SUPER_ADMIN' | 'CONTENT_EDITOR' | 'ENQUIRY_MANAGER' | 'VIEWER'>('CONTENT_EDITOR');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // My Credentials Form State
  const [showCredentialsCard, setShowCredentialsCard] = useState(false);
  const [myEmail, setMyEmail] = useState(currentUser.email || 'admin@siwiglobal.com');
  const [myFirstName, setMyFirstName] = useState(currentUser.first_name || 'Harshvardhan');
  const [myLastName, setMyLastName] = useState(currentUser.last_name || 'Patil');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newMyPassword, setNewMyPassword] = useState('');
  const [confirmMyPassword, setConfirmMyPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [updatingCredentials, setUpdatingCredentials] = useState(false);
  const [credentialsSuccess, setCredentialsSuccess] = useState<string | null>(null);
  const [credentialsError, setCredentialsError] = useState<string | null>(null);

  const loadUsers = () => {
    setLoading(true);
    api.getAdminUsers()
      .then((data) => {
        setUsers(data);
        // Find current user's actual email from DB if available
        const currentInDb = data.find((u) => u.id === currentUser.id || u.email === currentUser.email);
        if (currentInDb) {
          setMyEmail(currentInDb.email);
          setMyFirstName(currentInDb.first_name);
          setMyLastName(currentInDb.last_name);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading admin users:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Handle Add New Admin User
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    const emailTrimmed = newEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setAddError('Please enter a valid administrative email address.');
      return;
    }

    if (newPassword.length < 6) {
      setAddError('Initial password must be at least 6 characters.');
      return;
    }

    if (newPassword !== newConfirmPassword) {
      setAddError('Passwords do not match. Please retype to confirm.');
      return;
    }

    setAddingUser(true);
    try {
      await api.createAdminUser({
        first_name: newFirstName.trim(),
        last_name: newLastName.trim(),
        email: emailTrimmed,
        password: newPassword,
        role: newRole,
      });

      setShowAddModal(false);
      setNewFirstName('');
      setNewLastName('');
      setNewEmail('');
      setNewPassword('');
      setNewConfirmPassword('');
      loadUsers();
    } catch (err: any) {
      setAddError(err.message || 'Failed to create administrator account');
    } finally {
      setAddingUser(false);
    }
  };

  // Handle Toggle Active/Inactive
  const handleToggleStatus = async (user: AdminUser) => {
    const isCurrentlyActive = user.is_active !== 0;
    const actionName = isCurrentlyActive ? 'deactivate' : 'activate';

    if (!window.confirm(`Are you sure you want to ${actionName} administrator account ${user.email}?`)) {
      return;
    }

    try {
      await api.updateAdminUserStatus(user.id, {
        is_active: isCurrentlyActive ? 0 : 1,
      });
      loadUsers();
    } catch (err: any) {
      alert(err.message || `Failed to ${actionName} account`);
    }
  };

  // Handle Delete Secondary Admin
  const handleDeleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Permanently delete administrative account for ${user.first_name} ${user.last_name} (${user.email})? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.deleteAdminUser(user.id);
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete administrative account');
    }
  };

  // Handle Update Logged-in Credentials (Email & Password)
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsError(null);
    setCredentialsSuccess(null);

    if (!currentPassword) {
      setCredentialsError('Your current password is required to authorize credentials changes.');
      return;
    }

    const emailTrimmed = myEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setCredentialsError('Please provide a valid administrative email format.');
      return;
    }

    if (newMyPassword) {
      if (newMyPassword.length < 6) {
        setCredentialsError('New password must be at least 6 characters long.');
        return;
      }
      if (newMyPassword !== confirmMyPassword) {
        setCredentialsError('New passwords do not match. Please retype to confirm.');
        return;
      }
    }

    setUpdatingCredentials(true);
    try {
      const res = await api.updateMyCredentials({
        current_password: currentPassword,
        new_email: emailTrimmed,
        first_name: myFirstName.trim(),
        last_name: myLastName.trim(),
        new_password: newMyPassword ? newMyPassword : undefined,
      });

      // Update local storage so topbar reflects new email and name
      const updatedProfile = {
        ...currentUser,
        first_name: myFirstName.trim(),
        last_name: myLastName.trim(),
        email: emailTrimmed,
      };
      localStorage.setItem('siwi_admin_user', JSON.stringify(updatedProfile));

      setCredentialsSuccess('Credentials updated successfully. Your new email and password are now active.');
      setCurrentPassword('');
      setNewMyPassword('');
      setConfirmMyPassword('');
      loadUsers();
      setTimeout(() => setCredentialsSuccess(null), 5000);
    } catch (err: any) {
      setCredentialsError(err.message || 'Failed to update administrative credentials');
    } finally {
      setUpdatingCredentials(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-brand-gold" />
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Administrator Accounts &amp; Access Control
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Manage authorized operators, assign role permissions, and maintain root credentials security.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCredentialsCard(!showCredentialsCard)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded hover:border-brand-gold transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-brand-gold" />
            <span>{showCredentialsCard ? 'Close Security Settings' : 'Change My ID / Password'}</span>
          </button>

          <button
            onClick={() => {
              setAddError(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Administrator</span>
          </button>
        </div>
      </div>

      {/* Security & Credentials Drawer / Card */}
      {showCredentialsCard && (
        <div className="bg-white dark:bg-neutral-900 border-2 border-brand-gold/30 rounded-lg p-6 space-y-6 shadow-md transition-all">
          <div className="flex items-start justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-gold/10 rounded-lg">
                <Lock className="w-5 h-5 text-brand-gold" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Update Administrator Credentials &amp; Login Security
                </h2>
                <p className="text-xs text-neutral-500">
                  Securely modify your primary login email address and administrative password.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCredentialsCard(false)}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {credentialsSuccess && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 text-xs text-green-700 dark:text-green-400 rounded flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{credentialsSuccess}</span>
            </div>
          )}

          {credentialsError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 rounded flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{credentialsError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateCredentials} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Main Email / Login ID *
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    value={myEmail}
                    onChange={(e) => setMyEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={myFirstName}
                  onChange={(e) => setMyFirstName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={myLastName}
                  onChange={(e) => setMyLastName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 rounded-lg space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-gold" />
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                  Authentication &amp; Password Update
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Current Password * (Verification)
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                      className="w-full px-3 py-2 pr-9 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPass(!showCurrentPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    New Password (Leave blank to keep)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={newMyPassword}
                      onChange={(e) => setNewMyPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 pr-9 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmMyPassword}
                    onChange={(e) => setConfirmMyPassword(e.target.value)}
                    placeholder="Retype new password"
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCredentialsCard(false)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-medium rounded hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updatingCredentials}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-gold text-neutral-950 text-xs font-semibold rounded hover:bg-brand-goldLight transition-colors disabled:opacity-50"
              >
                {updatingCredentials ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                <span>{updatingCredentials ? 'Verifying & Saving...' : 'Save Updated Credentials'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Directory & Operators Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search administrators by name or email..."
              className="w-full px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
            />
          </div>

          <span className="text-xs text-neutral-500">
            Active Accounts: <strong className="text-neutral-900 dark:text-neutral-100">{users.filter((u) => u.is_active !== 0).length}</strong> / {users.length}
          </span>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-neutral-500 font-mono">
              <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
              <span>Loading registered administrators...</span>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold uppercase text-neutral-500">
                <tr>
                  <th className="py-3 px-4">Operator Name</th>
                  <th className="py-3 px-4">Email / Login ID</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4 text-center">Account Status</th>
                  <th className="py-3 px-4">Added On</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400">
                      No administrative accounts found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isActive = u.is_active !== 0;
                    const isSelf = u.id === currentUser.id || u.email === currentUser.email;
                    const isRoot = u.id === 'usr_admin_1';

                    return (
                      <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-brand-gold/15 text-brand-gold font-semibold flex items-center justify-center text-xs flex-shrink-0">
                              {u.first_name?.[0] || 'A'}
                            </div>
                            <div>
                              <span className="font-semibold text-neutral-900 dark:text-neutral-100 block">
                                {u.first_name} {u.last_name}
                              </span>
                              {isSelf && (
                                <span className="text-[10px] text-brand-gold font-mono font-medium">
                                  (Current Session)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                          {u.email}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                              u.role === 'SUPER_ADMIN'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                : u.role === 'CONTENT_EDITOR'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                              isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            {isActive ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                            <span>{isActive ? 'Active' : 'Suspended'}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-neutral-400 text-[11px] font-mono">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Initial'}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* Toggle Active status */}
                            <button
                              onClick={() => handleToggleStatus(u)}
                              disabled={isSelf}
                              title={isSelf ? 'Cannot deactivate yourself' : isActive ? 'Deactivate Account' : 'Activate Account'}
                              className={`p-1.5 rounded transition-colors ${
                                isSelf
                                  ? 'opacity-30 cursor-not-allowed text-neutral-400'
                                  : isActive
                                  ? 'text-neutral-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20'
                                  : 'text-neutral-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20'
                              }`}
                            >
                              {isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(u)}
                              disabled={isSelf || isRoot}
                              title={isRoot ? 'Root administrator account cannot be deleted' : isSelf ? 'Cannot delete yourself' : 'Delete Account'}
                              className={`p-1.5 rounded transition-colors ${
                                isSelf || isRoot
                                  ? 'opacity-30 cursor-not-allowed text-neutral-400'
                                  : 'text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal: Add Administrator */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-brand-gold" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Register New Administrator
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-xs text-red-600 dark:text-red-400 rounded flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    required
                    placeholder="e.g. Rahul"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    required
                    placeholder="e.g. Sharma"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Corporate Email Address *
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  placeholder="operator@siwiglobal.com"
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Assigned Administrative Role *
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-brand-gold font-mono"
                >
                  <option value="CONTENT_EDITOR">CONTENT_EDITOR · Manage Catalogue &amp; CMS</option>
                  <option value="ENQUIRY_MANAGER">ENQUIRY_MANAGER · Buyer Enquiries Triage</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN · Full Access Control</option>
                  <option value="VIEWER">VIEWER · Read-Only Access</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Initial Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Min 6 chars"
                      className="w-full px-3 py-2 pr-8 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:border-brand-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    >
                      {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={newConfirmPassword}
                    onChange={(e) => setNewConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-600 dark:text-neutral-300 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-brand-gold text-neutral-950 font-semibold rounded hover:bg-brand-goldLight transition-colors disabled:opacity-50"
                >
                  {addingUser ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{addingUser ? 'Creating...' : 'Register Administrator'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
