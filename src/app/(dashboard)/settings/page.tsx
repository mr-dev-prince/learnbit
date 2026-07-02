import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/70">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="rounded-lg border border-border bg-card-background p-6"
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Settings size={20} style={{ color: 'var(--primary)' }} />
            Account Settings
          </h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 text-left text-foreground/75 transition-colors hover:text-foreground">
              Change Password
            </button>
            <button className="w-full px-4 py-2 text-left text-foreground/75 transition-colors hover:text-foreground">
              Email Preferences
            </button>
            <button className="w-full px-4 py-2 text-left text-foreground/75 transition-colors hover:text-foreground">
              Privacy Settings
            </button>
          </div>
        </div>

        <div
          className="rounded-lg border border-border bg-card-background p-6"
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Settings size={20} style={{ color: 'var(--primary)' }} />
            Learning Preferences
          </h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 text-left text-foreground/75 transition-colors hover:text-foreground">
              Learning Goals
            </button>
            <button className="w-full px-4 py-2 text-left text-foreground/75 transition-colors hover:text-foreground">
              Notification Preferences
            </button>
            <button className="w-full px-4 py-2 text-left text-foreground/75 transition-colors hover:text-foreground">
              Difficulty Level
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
