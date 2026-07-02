import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { UnauthorizedError } from './api/errors';
import { cache } from 'react';

export const getAuthenticatedUser = cache(async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
});
