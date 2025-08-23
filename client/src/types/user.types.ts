export type Role = "attendee" | "organizer" | "admin"

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  location: string;
  roles: Role[];
}