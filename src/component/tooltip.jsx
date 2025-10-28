import React from "react";

function Tooltip({ children, className }) {
  return (
    <div
      className={`bg-black rounded-[8px] text-[12px] text-white py-2 px-2 hidden group-hover:block absolute whitespace-nowrap ${className}`}
    >
      {children}
    </div>
  );
}

export default Tooltip;
