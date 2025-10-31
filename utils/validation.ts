import { FormField } from "@/components/form/Form";
import { RegisterFormData } from "@/types/auth";

export const formFields: FormField<RegisterFormData>[] = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "Enter your full name",
    autoCapitalize: "words",
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
    rules: {
      required: "Please confirm your password",
      validate: ((value: string, formValues: any) => {
        return value === formValues.password || "Passwords do not match";
      }) as unknown as (value: string) => string | boolean,
    },
  },
];
