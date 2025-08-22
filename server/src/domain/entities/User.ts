export type Role = 'attendee' | 'organizer' | 'admin';

export interface User {
  email: string;
  password: string;
  name: string;
  phone: string;
  location: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}
