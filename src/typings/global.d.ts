import { MemberRole } from 'src/shared';

declare module 'express' {
  interface Request {
    staff: {
      id: string;
      name: string;
      email: string;
      role: MemberRole;
    };
  }
}

export {};
