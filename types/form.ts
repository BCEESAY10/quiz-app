import { FieldValues, Path } from "react-hook-form";

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder: string;
  defaultValue?: string;
  rules?: {
    required?: string;
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    validate?: (value: string) => string | boolean;
  };
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export interface FormComponentProps<T extends FieldValues> {
  fields: FormField<T>[];
  onSubmit: (data: T) => void;
  submitButtonText: string;
  isLoading?: boolean;
  resetSignal?: number;
}
