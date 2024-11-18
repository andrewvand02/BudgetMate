import React from "react";
import { useMode } from "./ModeContext";
import lightImage from "./assets/budget.png";
import darkImage from "./assets/darkbudget.png";

const ImageSwitcher = () => {
  const { isDarkMode } = useMode();

  return (
    <div>
      <img
        src={isDarkMode ? darkImage : lightImage}
        alt="Themed Illustration"
        style={{ width: "700px", height: "auto" }}
      />
    </div>
  );
};

export default ImageSwitcher;
