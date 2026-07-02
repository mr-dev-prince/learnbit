import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AuthScreen from '@/components/auth/AuthScreen';
import { createClient } from '@/utils/supabase/server';

export default async function SignupPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return <AuthScreen mode="signup" />;
}
