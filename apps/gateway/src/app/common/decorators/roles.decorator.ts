import { SetMetadata } from '@nestjs/common';
import { EnumRole } from '@prisma/client';

export const ROLE_KEY = 'role';
export const Role = (role: EnumRole) => SetMetadata(ROLE_KEY, role);
