import React from "react";
import { Image } from "antd";

interface IProps {
  image: string;
  shape?: "circle" | "square";
  styles?: React.CSSProperties | undefined;
  className?: string;
}

export const PreviewImage = ({
  className,
  image,
  shape = "square",
  styles,
}: IProps) => {
  return (
    <Image.PreviewGroup>
      <Image
        className={`${shape === "circle" && "rounded-full"} ${className}`}
        src={image || "/logo.png"}
        placeholder=""
        style={
          styles
            ? styles
            : {
                border: "none",
                overflow: "hidden",
                maxHeight: 30,
                width: 40,
                height: "auto",
                objectFit: "cover",
              }
        }

        // size={30}
      />
    </Image.PreviewGroup>
  );
};
