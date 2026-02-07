export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  currentPassword?: string;
  newPassword?: string;
  defaultValue?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  defaultValue?: string;
}
