import { useState, useRef, useLayoutEffect } from "react";
import useClickOutside from "../../hooks/use-click-outside";

export default function Dropdown({ trigger, items, className }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({});
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useClickOutside(wrapperRef, () => setOpen(false));

  // Auto-position so menu stays inside viewport
  useLayoutEffect(() => {
    if (!open || !menuRef.current || !wrapperRef.current) return;

    const menu = menuRef.current.getBoundingClientRect();
    const triggerBox = wrapperRef.current.getBoundingClientRect();

    let styles = { top: "100%", left: 0 };

    // If right goes outside viewport → align right
    if (menu.width + triggerBox.left > window.innerWidth) {
      styles = { top: "100%", right: 0 };
    }

    // If bottom goes outside → open upward
    if (menu.height + triggerBox.bottom > window.innerHeight) {
      styles = { bottom: "100%", left: 0 };
    }

    setPosition(styles);
  }, [open]);

  return (
    <div ref={wrapperRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => setOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      {open && (
        <div
          ref={menuRef}
          style={position}
          className="absolute z-50 min-w-[150px] bg-white dark:bg-zinc-900 
                     border border-zinc-200 dark:border-zinc-700 rounded-lg 
                     shadow-md p-1"
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                item.onClick?.();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm 
                         rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
