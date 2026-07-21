export interface Student {
  // json-server assigns numeric ids to seed data, string uuids to new POSTs.
  id: number | string;
  name: string;
  role: string;
  avatar: string;
  email?: string;
  bio?: string;
  experienceYears?: number;
  hobbies?: string[];
}
