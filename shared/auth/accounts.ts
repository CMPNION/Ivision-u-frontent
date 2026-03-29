import type { UserRole } from "@/shared/types/applications";

export type MockAccount = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

export const mockAccounts: MockAccount[] = [
  {
    email: "dmidmi11@example.com",
    password: "password123",
    firstName: "Дима",
    lastName: "Дмитриев",
    role: "committee",
  },
  {
    email: "abddan@example.com",
    password: "password123",
    firstName: "Абдрахманов",
    lastName: "Данияр",
    role: "abiturient",
  },
];

export const getAccountByEmail = (email: string): MockAccount | undefined =>
  mockAccounts.find(
    (account) => account.email.toLowerCase() === email.toLowerCase(),
  );
