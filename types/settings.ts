import { User } from "./user";

export interface SettingsProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateProfile?: (user: User) => void;
  onChangePassword?: () => void;
  onDeleteAccount?: () => void;
}
