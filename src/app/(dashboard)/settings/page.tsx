import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileSettings from '@/components/settings/ProfileSettings';
import { createClient } from '@/utils/supabase/server';

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const fullName =
    typeof user.user_metadata.full_name === 'string' ? user.user_metadata.full_name : '';

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/70">Manage your account and preferences</p>
      </div>
      <ProfileSettings email={user.email ?? ''} fullName={fullName} />
    </div>
  );
}
