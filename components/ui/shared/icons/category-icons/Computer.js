import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgComputer = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="#1f1f1f"
    viewBox="0 -960 960 960"
    {...props}
  >
    <Path d="M40-120v-80h880v80zm120-120q-33 0-56.5-23.5T80-320v-440q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v440q0 33-23.5 56.5T800-240zm0-80h640v-440H160zm0 0v-440z" />
  </Svg>
);
export default SvgComputer;
