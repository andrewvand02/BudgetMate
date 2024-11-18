import React from "react";
import { useMode } from "./ModeContext";
import "./Mode.css";

const Mode = () => {
  const { isDarkMode, toggleMode } = useMode();

  return (
    <div className="switch">
      <label>
        <input
          type="checkbox"
          checked={isDarkMode}
          onChange={toggleMode}
        />
        <span className="slider theme"></span>
      </label>
    </div>
  );
};

export default Mode;
