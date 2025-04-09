import { ImgHTMLAttributes } from "react";
import LogoImg from "assets/images/logo.png";

export interface AppLogoProps {
  width?: number;
  height?: number;
}

export const AppLogo = ({ width = 100, height }: AppLogoProps) => {
  return (
    <div
      style={{
        display: "block",
        width,
        height,
      }}
    >
      <img className="full animate-pulse" src={LogoImg} />
    </div>
  );
};
