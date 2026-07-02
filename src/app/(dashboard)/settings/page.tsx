import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div
          className="rounded-lg border p-6 bg-slate-900/30"
          style={{ borderColor: 'var(--primary)' }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings size={20} style={{ color: 'var(--primary)' }} />
            Account Settings
          </h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 text-left text-slate-300 hover:text-white transition-colors">
              Change Password
            </button>
            <button className="w-full px-4 py-2 text-left text-slate-300 hover:text-white transition-colors">
              Email Preferences
            </button>
            <button className="w-full px-4 py-2 text-left text-slate-300 hover:text-white transition-colors">
              Privacy Settings
            </button>
          </div>
        </div>

        {/* Learning Preferences */}
        <div
          className="rounded-lg border p-6 bg-slate-900/30"
          style={{ borderColor: 'var(--primary)' }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Settings size={20} style={{ color: 'var(--primary)' }} />
            Learning Preferences
          </h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 text-left text-slate-300 hover:text-white transition-colors">
              Learning Goals
            </button>
            <button className="w-full px-4 py-2 text-left text-slate-300 hover:text-white transition-colors">
              Notification Preferences
            </button>
            <button className="w-full px-4 py-2 text-left text-slate-300 hover:text-white transition-colors">
              Difficulty Level
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
