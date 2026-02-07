import { Colors } from "@/constants/theme";
import { FormComponentProps } from "@/types/form";
import { useMemo } from "react";
import {
  Controller,
  DefaultValues,
  FieldValues,
  useForm,
} from "react-hook-form";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export function FormComponent<T extends FieldValues>({
  fields,
  onSubmit,
  submitButtonText,
  isLoading = false,
}: FormComponentProps<T>) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const defaultValues = useMemo<Partial<T>>(() => {
    const values: Partial<T> = {};
    fields.forEach((field) => {
      values[field.name as keyof T] = "" as any;
    });
    return values;
  }, [fields]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({
    defaultValues: defaultValues as DefaultValues<T>,
  });

  return (
    <View style={styles.formContainer}>
      {fields.map((field) => (
        <View key={field.name} style={styles.fieldContainer}>
          <Text style={[styles.label, { color: theme.text }]}>
            {field.label}
          </Text>
          <Controller
            control={control}
            name={field.name}
            rules={field.rules}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  Platform.OS === "web"
                    ? ({ outlineStyle: "none" } as any)
                    : null,
                  {
                    backgroundColor: theme.background,
                    borderColor: errors[field.name] ? "#F44336" : "#E8EAED",
                    color: theme.text,
                  },
                ]}
                placeholder={field.placeholder}
                placeholderTextColor={theme.icon}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value || ""}
                secureTextEntry={field.secureTextEntry}
                keyboardType={field.keyboardType || "default"}
                autoCapitalize={field.autoCapitalize || "none"}
                autoCorrect={false}
              />
            )}
          />
          {errors[field.name] && (
            <Text style={styles.errorText}>
              {errors[field.name]?.message as string}
            </Text>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}>
        <Text style={styles.submitButtonText}>
          {isLoading ? "Loading..." : submitButtonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E8EAED",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#2C3E50",
  },
  errorText: {
    color: "#F44336",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: "#5B48E8",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#5B48E8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#BDC3C7",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
