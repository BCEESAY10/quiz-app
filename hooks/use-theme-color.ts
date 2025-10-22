/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useTheme } from "@react-navigation/native";

type ThemeProps = {
  light?: string;
  dark?: string;
};

export function useThemeColor(
  props: ThemeProps,
  colorName: keyof ReturnType<typeof useTheme>["colors"]
) {
  const { colors, dark } = useTheme();
  const colorFromProps = dark ? props.dark : props.light;

  return colorFromProps ?? colors[colorName];
}
