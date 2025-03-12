import { SvgIcon, SvgIconProps } from "@mui/material";
import logo0g from "public/images/blockchains/0G_gradient_logo.svg";

const OGLogo = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 244 120">
    <defs>
      <linearGradient
        id="linear-gradient"
        x1="241.2"
        y1="94.6"
        x2="-4.2"
        y2="29.8"
        gradientTransform="translate(0 122.4) scale(1 -1)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#ffdb3b" />
        <stop offset="0.2" stopColor="#ff6270" />
        <stop offset="0.4" stopColor="#ff1ce6" />
        <stop offset="0.6" stopColor="#b14eff" />
        <stop offset="0.8" stopColor="#3badff" />
        <stop offset="1" stopColor="#6be5ff" />
      </linearGradient>
    </defs>
    <path
      fill="url(#linear-gradient)"
      d="M67.9-9h108.2c37.7,0,68.3,30.6,68.3,68.3s-30.6,68.3-68.3,68.3h-108.2C30.2,127.5-.4,97-.4,59.3S30.2-9,67.9-9Z"
    />
  </SvgIcon>
);

export default OGLogo;
