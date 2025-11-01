import { User } from "@/types/user";

const STORAGE_KEY = "users";

export function getUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUser(newUser: User) {
  const users = getUsers();

  if (users.some((u) => u.email === newUser.email)) {
    throw new Error("Email already exists");
  }

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function loginUser(email: string, password: string) {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  return user || null;
}
