import React from "react";

export interface ActionDropdownProps {
  isOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  width?: string;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  isOpen,
  menuRef,
  children,
  width = "150px",
}) => {
  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-full top-0 mr-2 bg-white border border-slate-200 rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2),0_8px_10px_-6px_rgba(0,0,0,0.1)] z-[99999] flex flex-col py-1"
      style={{ width }}
    >
      {children}
    </div>
  );
};

export default ActionDropdown;
