import React from "react";
import PinIMG from "assets/images/pin.png";

export const Marker = React.memo(
  ({ lat, lng }: { lat: number; lng: number }) => {
    console.log("render Marker:", lat, lng);
    return (
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translate(-50%, -100%)",
        }}
      >
        <img
          src={PinIMG}
          style={{ width: 40 }}
          alt=""
        />
      </div>
    );
  }
);
