"use client";

import { useState } from "react";
import ChatPanel from "./ChatPanel";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-100 transition-all duration-300 ease-in-out ${
        isExpanded ? "w-80" : "w-0"
      }`}
    >
      <div className="relative">
        <button
          className="absolute top-0 -left-12 w-12 h-12 bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
          onClick={toggleSidebar}
        >
          {isExpanded ? ">" : "<"}
        </button>
        {isExpanded && <ChatPanel />}
      </div>
    </div>
  );
};

export default Sidebar;
