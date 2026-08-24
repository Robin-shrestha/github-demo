export const ROLES = ["Frontend", "Backend", "Fullstack", "QA", "DevOps"] as const;

export interface Student {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  bio?: string;
  experienceYears?: number;
  hobbies?: string[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  dateOfBirth?: string;
  address?: string;
  profilePic: string;
  idDocuments?: string[];
}
