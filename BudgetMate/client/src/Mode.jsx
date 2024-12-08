import React from "react";
import { useMode } from "./ModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
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
        <span className="slider theme">
          {/* Icons inside the slider */}
          <span className="icon sun">
            <FontAwesomeIcon icon={faSun} />
          </span>
          <span className="icon moon">
            <FontAwesomeIcon icon={faMoon} />
          </span>
        </span>
      </label>
    </div>
  );
};

export default Mode;
