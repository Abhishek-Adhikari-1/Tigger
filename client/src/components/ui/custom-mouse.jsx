import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCursor } from "../../context/CursorContext";

// ── Global mouse position tracker ──────────────────────────
// Tracks mouse position at ALL times (even when custom cursor is disabled)
// so we always know where to spawn the cursor.
const globalMouse = { x: -1, y: -1, tracked: false };

function initGlobalTracker() {
  if (globalMouse.tracked) return;
  globalMouse.tracked = true;

  document.addEventListener(
    "mousemove",
    (e) => {
      globalMouse.x = e.clientX;
      globalMouse.y = e.clientY;
    },
    { passive: true },
  );
}

// ── Component ──────────────────────────────────────────────
export default function CustomMouse({ children }) {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  const [variant, setVariant] = useState("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rafRef = useRef(null);
  const { customCursor: enabled } = useCursor();

  // Start global tracker on mount
  useEffect(() => {
    initGlobalTracker();
  }, []);

  useEffect(() => {
    // Detect touch devices — no custom cursor needed
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (hasTouch) {
      setIsTouchDevice(true);
      return;
    }
  }, []);

  // Toggle `cursor: none` globally on <html> so it covers
  // ALL elements including Clerk portals, modals, dropdowns, etc.
  useEffect(() => {
    const html = document.documentElement;
    if (enabled && !isTouchDevice) {
      html.classList.add("custom-cursor-active");
    } else {
      html.classList.remove("custom-cursor-active");
    }
    return () => html.classList.remove("custom-cursor-active");
  }, [enabled, isTouchDevice]);

  useEffect(() => {
    if (!enabled || isTouchDevice) return;

    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    // If we already know where the mouse is, snap there immediately
    const hasPosition = globalMouse.x >= 0 && globalMouse.y >= 0;

    let mouseX = hasPosition ? globalMouse.x : 0;
    let mouseY = hasPosition ? globalMouse.y : 0;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let trailX = mouseX;
    let trailY = mouseY;

    // If we have a known position, show cursor immediately at that spot
    if (hasPosition) {
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
      setIsVisible(true);
    }

    const cursorSpeed = 0.18;
    const trailSpeed = 0.08;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // If cursor wasn't visible yet (no prior position), snap to first position
      if (!hasPosition && !isVisible) {
        cursorX = mouseX;
        cursorY = mouseY;
        trailX = mouseX;
        trailY = mouseY;
      }

      setIsVisible(true);

      const target = e.target;

      if (
        target.closest(
          "button, a, [role='button'], label, [data-clickable], summary",
        )
      ) {
        setVariant("pointer");
      } else if (target.closest("input, textarea, [contenteditable]")) {
        setVariant("text");
      } else {
        setVariant("default");
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Snap to entry position so it doesn't slide from previous spot
      cursorX = mouseX;
      cursorY = mouseY;
      trailX = mouseX;
      trailY = mouseY;
      setIsVisible(true);
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * cursorSpeed;
      cursorY += (mouseY - cursorY) * cursorSpeed;
      trailX += (mouseX - trailX) * trailSpeed;
      trailY += (mouseY - trailY) * trailSpeed;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, isTouchDevice]);

  // Don't render custom cursor on touch devices or when disabled
  if (isTouchDevice || !enabled) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="custom-mouse-wrapper h-full">{children}</div>
      {createPortal(
        <>
          <div
            ref={trailRef}
            className={`custom-cursor-trail ${variant} ${isVisible ? "visible" : ""}`}
          />
          <div
            ref={cursorRef}
            className={`custom-cursor ${variant} ${isVisible ? "visible" : ""}`}
          />
        </>,
        document.body,
      )}
    </>
  );
}
