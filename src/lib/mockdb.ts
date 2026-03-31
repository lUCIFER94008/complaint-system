export type User = { name?: string; email: string; password: string; role: "user" | "admin" };

export const users: User[] = [
  { name: "System Admin", email: "admin@example.com", password: "admin", role: "admin" },
];

export const complaints: any[] = [];

export const feedback: any[] = [];