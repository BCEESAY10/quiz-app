import { User } from "@/types/user";
import { Platform } from "react-native";

let AsyncStorage:
  | typeof import("@react-native-async-storage/async-storage").default
  | null = null;
if (Platform.OS !== "web") {
  import("@react-native-async-storage/async-storage")
    .then((mod) => {
      AsyncStorage = mod.default;
    })
    .catch(() => {
      AsyncStorage = null;
    });
}

const STORAGE_KEY = "users";

export async function getUsers(): Promise<User[]> {
  if (typeof window !== "undefined" && Platform.OS === "web") {
    const data = window.localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } else if (AsyncStorage) {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } else {
    return [];
  }
}

export async function saveUser(newUser: User): Promise<void> {
  const users = await getUsers();

  if (users.some((u) => u.email === newUser.email)) {
    throw new Error("Email already exists");
  }

  users.push(newUser);
  const serialized = JSON.stringify(users);

  if (Platform.OS === "web") {
    localStorage.setItem(STORAGE_KEY, serialized);
  } else {
    await AsyncStorage?.setItem(STORAGE_KEY, serialized);
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<User | null> {
  const users = await getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  return user || null;
}
