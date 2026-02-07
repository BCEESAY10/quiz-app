import { LoginFormData, RegisterFormData } from "@/types/auth";
import { FormField } from "@/types/form";

export const formFields: FormField<RegisterFormData>[] = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "Enter your full name",
    autoCapitalize: "words",
    defaultValue: "",
    rules: {
      required: "Full name is required",
      minLength: {
        value: 3,
        message: "Name must be at least 3 characters",
      },
      pattern: {
        value: /^[a-zA-Z\s]+$/,
        message: "Name can only contain letters and spaces",
      },
    },
  },
  {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    keyboardType: "email-address",
    autoCapitalize: "none",
    defaultValue: "",
    rules: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Create a password",
    secureTextEntry: true,
    defaultValue: "",
    rules: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: "Password must contain uppercase, lowercase, and number",
      },
    },
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    secureTextEntry: true,
    defaultValue: "",
    rules: {
      required: "Please confirm your password",
      validate: ((value: string, formValues: any) => {
        return value === formValues.password || "Passwords do not match";
      }) as unknown as (value: string) => string | boolean,
    },
  },
];

export const loginFields: FormField<LoginFormData>[] = [
  {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    keyboardType: "email-address",
    autoCapitalize: "none",
    defaultValue: "",
    rules: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Create a password",
    secureTextEntry: true,
    defaultValue: "",
    rules: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: "Password must contain uppercase, lowercase, and number",
      },
    },
  },
];

export const resetPasswordField: FormField<LoginFormData>[] = [
  {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    keyboardType: "email-address",
    autoCapitalize: "none",
    defaultValue: "",
    rules: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
  },
];

export const newPasswordFields: FormField<RegisterFormData>[] = [
  {
    name: "password",
    label: "Password",
    placeholder: "Create a password",
    secureTextEntry: true,
    defaultValue: "",
    rules: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: "Password must contain uppercase, lowercase, and number",
      },
    },
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    secureTextEntry: true,
    defaultValue: "",
    rules: {
      required: "Please confirm your password",
      validate: ((value: string, formValues: any) => {
        return value === formValues.password || "Passwords do not match";
      }) as unknown as (value: string) => string | boolean,
    },
  },
];

export const changePasswordFields: FormField<RegisterFormData>[] = [
  {
    name: "currentPassword",
    label: "Current Password",
    placeholder: "Enter your current password",
    secureTextEntry: true,
    defaultValue: "",
    rules: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: "Password must contain uppercase, lowercase, and number",
      },
    },
  },
  {
    name: "newPassword",
    label: "New Password",
    placeholder: "Enter your new password",
    secureTextEntry: true,
    defaultValue: "",
    rules: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters",
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: "Password must contain uppercase, lowercase, and number",
      },
    },
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    secureTextEntry: true,
    defaultValue: "",
    rules: {
      required: "Please confirm your password",
      validate: ((value: string, formValues: any) => {
        return value === formValues.newPassword || "Passwords do not match";
      }) as unknown as (value: string) => string | boolean,
    },
  },
];
