import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import {
  listArchitectures,
  createArchitecture,
  parseArchitecturePayload,
} from '@/lib/architectures';

export const GET = () =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const architectures = await listArchitectures(user.id);
    return new ApiResponse(architectures);
  });

export const POST = (request: NextRequest) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const payload = parseArchitecturePayload(body);
    const architecture = await createArchitecture(user.id, payload);
    return new ApiResponse(architecture, 'Architecture created successfully', 201);
  });
