import React from "react";
import ReactDOM from "react-dom";
import { Rnd } from "react-rnd";
import { useEffect, useState, useRef } from "react";
import { Maximize, Minus, X, Square } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { useAppSound } from "./sound-context";
import { CuteSuspenseFallback } from "./suspense-fallback";
import { SnapMenu, type SnapType } from "./SnapMenu";

let globalZ = 100;
const getOptimalWindowSize = (title: string) => {
  switch (title) {
    case "About me":
      return { width: 800, height: 600 };
    case "Resume":
      return { width: 850, height: 600 };
    case "Projects":
      return { width: 900, height: 600 };
    case "Blog":
      return { width: 850, height: 600 };
    case "Links":
      return { width: 750, height: 600 };
    case "Contact me":
      return { width: 800, height: 600 };
    default:
      return { width: 800, height: 600 };
  }
};
export function AppWindow({
  title,
  children,
  onClose,
  onMinimize,
  isMobile = false,
  isMinimized = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  isMobile?: boolean;
  isMinimized?: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(globalZ++);
  const [isMaximized, setIsMaximized] = useState(isMobile ? true : false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState<{ width: string | number; height: string | number }>(
    getOptimalWindowSize(title)
  );
  const [isVisible, setIsVisible] = useState(false);
  const [prevSize, setPrevSize] = useState<{ width: string | number; height: string | number }>(
    size
  );
  const [prevPosition, setPrevPosition] = useState(position);
  const rndRef = useRef<Rnd>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const {
    playWindowOpenSound,
    playWindowCloseSound,
    playMinimizeSound,
    playMaximizeSound,
    playClickSound,
  } = useAppSound();
  useEffect(() => {
    if (hasInitialized.current) return;

    const sizeWidth = typeof size.width === 'number' ? size.width : 800;
    const sizeHeight = typeof size.height === 'number' ? size.height : 600;
    const centerX = window.innerWidth / 2 - sizeWidth / 2;
    const centerY = window.innerHeight / 2 - sizeHeight / 2;
    setPosition({
      x: Math.max(10, Math.min(centerX, window.innerWidth - sizeWidth - 10)),
      y: Math.max(10, Math.min(centerY, window.innerHeight - sizeHeight - 10)),
    });
    setIsVisible(true);
    playWindowOpenSound();
    hasInitialized.current = true;
  }, [size.width, size.height, playWindowOpenSound]);
  useEffect(() => {
    if (isMobile) {
      setIsMaximized(true);
    }
  }, [isMobile]);
  const bringToFront = () => setZIndex(++globalZ);
  const toggleMaximize = () => {
    bringToFront();
    if (isMobile) return;
    if (!isMaximized) {
      setPrevSize(size);
      setPrevPosition(position);
      setIsMaximized(true);
      playMaximizeSound();
    } else {
      setSize(prevSize);
      setPosition(prevPosition);
      setIsMaximized(false);
      playMaximizeSound();
    }
  };
  const handleClose = () => {
    playWindowCloseSound();
    // Exit animation
    if (windowRef.current) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) {
        gsap.to(windowRef.current, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => onClose?.(),
        });
      } else {
        gsap.to(windowRef.current, {
          opacity: 0,
          scale: 0.9,
          y: isMobile ? 20 : 0,
          duration: 0.2,
          ease: "power2.out",
          onComplete: () => onClose?.(),
        });
      }
    } else {
      onClose?.();
    }
  };
  const handleMinimize = () => {
    playMinimizeSound();
    onMinimize?.();
  };
  const handleButtonClick = (action: () => void) => {
    playClickSound();
    action();
  };
  useEffect(() => {
    const handleResize = () => {
      if (isMaximized && !isMobile) {
        if (rndRef.current) {
          rndRef.current.updateSize({
            width: window.innerWidth,
            height: window.innerHeight,
          });
          rndRef.current.updatePosition({ x: 0, y: 0 });
        }
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isMaximized, isMobile]);
  useEffect(() => {
    if (isMaximized && !isMobile && rndRef.current) {
      rndRef.current.updateSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      rndRef.current.updatePosition({ x: 0, y: 0 });
    }
  }, [isMaximized, isMobile]);
  const contentRef = useRef<HTMLDivElement>(null);
  const { width: contentWidth } = useResizeObserver(contentRef);
  // GSAP entrance animation
  useGSAP(() => {
    if (!isVisible || !windowRef.current) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // On mobile, keep it very light for performance
    if (isMobile) {
      gsap.fromTo(
        windowRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25 }
      );
      return;
    }
    if (prefersReducedMotion) {
      gsap.fromTo(
        windowRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    } else {
      gsap.fromTo(
        windowRef.current,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          ease: "power2.out",
        }
      );
    }
  }, [isVisible, isMobile]);
  // Helper function for button animations
  const handleButtonAnimation = (
    e: React.MouseEvent<HTMLButtonElement>,
    phase: "enter" | "leave" | "down" | "up"
  ) => {
    if (isMobile) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;
    const target = e.currentTarget;
    switch (phase) {
      case "enter":
        gsap.to(target, { scale: 1.1, duration: 0.1 });
        break;
      case "leave":
        gsap.to(target, { scale: 1, duration: 0.1 });
        break;
      case "down":
        gsap.to(target, { scale: 0.9, duration: 0.1 });
        break;
      case "up":
        gsap.to(target, { scale: 1.1, duration: 0.1 });
        break;
    }
  };

  const [snapType, setSnapType] = useState<SnapType | null>(null);

  const [snapPreview, setSnapPreview] = useState<SnapType | "maximize" | null>(null);

  const [showSnapMenu, setShowSnapMenu] = useState(false);
  const snapMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSnap = (type: SnapType) => {
    console.log(type);
    bringToFront();
    setSnapType(type);
    setIsMaximized(false);
    setShowSnapMenu(false);
  };

  const getSnapStyles = (type: SnapType | null): React.CSSProperties => {
    if (!type) return {};
    const common = {
      position: "fixed" as const,
      zIndex: zIndex,
      transition: "none",
      boxSizing: "border-box" as const,
    };

    switch (type) {
      case "left": return { ...common, top: 0, left: 0, width: "50vw", height: "100vh" };
      case "right": return { ...common, top: 0, left: "50vw", width: "50vw", height: "100vh" };
      case "top-left": return { ...common, top: 0, left: 0, width: "50vw", height: "50vh" };
      case "top-right": return { ...common, top: 0, left: "50vw", width: "50vw", height: "50vh" };
      case "bottom-left": return { ...common, top: "50vh", left: 0, width: "50vw", height: "50vh" };
      case "bottom-right": return { ...common, top: "50vh", left: "50vw", width: "50vw", height: "50vh" };

      case "left-wide": return { ...common, top: 0, left: 0, width: "66.66vw", height: "100vh" };
      case "right-narrow": return { ...common, top: 0, left: "66.66vw", width: "33.33vw", height: "100vh" };

      case "three-col-left": return { ...common, top: 0, left: 0, width: "33.33vw", height: "100vh" };
      case "three-col-center": return { ...common, top: 0, left: "33.33vw", width: "33.33vw", height: "100vh" };
      case "three-col-right": return { ...common, top: 0, left: "66.66vw", width: "33.33vw", height: "100vh" };

      case "four-grid-top-left": return { ...common, top: 0, left: 0, width: "50vw", height: "50vh" };
      case "four-grid-top-right": return { ...common, top: 0, left: "50vw", width: "50vw", height: "50vh" };
      case "four-grid-bottom-left": return { ...common, top: "50vh", left: 0, width: "50vw", height: "50vh" };
      case "four-grid-bottom-right": return { ...common, top: "50vh", left: "50vw", width: "50vw", height: "50vh" };

      case "left-half-right-top": return { ...common, top: 0, left: "50vw", width: "50vw", height: "50vh" };
      case "left-half-right-bottom": return { ...common, top: "50vh", left: "50vw", width: "50vw", height: "50vh" };

      case "center-wide-left": return { ...common, top: 0, left: 0, width: "25vw", height: "100vh" };
      case "center-wide-center": return { ...common, top: 0, left: "25vw", width: "50vw", height: "100vh" };
      default: return {};
    }
  };

  const handleSnapDragStart = (e: React.MouseEvent) => {
    bringToFront();
    if (snapType) {
      const newWidth = 800; // Default restore width
      const newHeight = 600;

      setSnapType(null);
      setSize({ width: newWidth, height: newHeight });
      setPosition({
        x: e.clientX - newWidth / 2,
        y: e.clientY - 20 // Offset for header
      });
    }
  };

  const handleMaximizeHover = () => {
    if (isMobile) return;
    if (snapMenuTimeoutRef.current) clearTimeout(snapMenuTimeoutRef.current);
    setShowSnapMenu(true);
  };

  const handleMaximizeLeave = () => {
    if (isMobile) return;
    snapMenuTimeoutRef.current = setTimeout(() => {
      setShowSnapMenu(false);
    }, 500);
  };

  const handleDrag = (e: any, d: any) => {
    if (isMaximized) return;

    const { x, y } = d;
    const cursorX = e.clientX;
    const cursorY = e.clientY;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const edgeThreshold = 20;

    // Reset preview initially
    let newSnap: typeof snapPreview = null;

    // Check corners first (higher priority)
    if (cursorY < edgeThreshold && cursorX < edgeThreshold) {
      newSnap = "top-left";
    } else if (cursorY < edgeThreshold && cursorX > screenW - edgeThreshold) {
      newSnap = "top-right";
    } else if (cursorY > screenH - edgeThreshold && cursorX < edgeThreshold) {
      newSnap = "bottom-left";
    } else if (
      cursorY > screenH - edgeThreshold &&
      cursorX > screenW - edgeThreshold
    ) {
      newSnap = "bottom-right";
    }
    // Then edges
    else if (cursorY < edgeThreshold) {
      newSnap = "maximize";
    } else if (cursorX < edgeThreshold) {
      newSnap = "left";
    } else if (cursorX > screenW - edgeThreshold) {
      newSnap = "right";
    }

    setSnapPreview(newSnap);
  };
  const handleDragStop = (e: any, d: any) => {
    if (snapPreview) {
      switch (snapPreview) {
        case "maximize":
          setIsMaximized(true);
          playMaximizeSound();
          break;
        default:
          // For all other snap types, use the new snapType state
          setSnapType(snapPreview);
          break;
      }
      setSnapPreview(null);
      setIsDragging(false);
      return;
    }

    setPosition({ x: d.x, y: d.y });
    setIsDragging(false);
  };


  return (
    <>
      {/* Snap Preview Ghost - Rendered via Portal to escape stacking contexts */}
      {snapPreview &&
        !isMinimized &&
        ReactDOM.createPortal(
          <div
            className="fixed z-[999999] bg-blue-500/20 border-2 border-blue-400 rounded-lg pointer-events-none transition-all duration-200 ease-out"
            style={{
              top:
                snapPreview === "bottom-left" || snapPreview === "bottom-right"
                  ? "50%"
                  : 0,
              left:
                snapPreview === "right" ||
                  snapPreview === "top-right" ||
                  snapPreview === "bottom-right"
                  ? "50%"
                  : 0,
              width:
                snapPreview === "maximize"
                  ? "100%"
                  : snapPreview === "left" || snapPreview === "right"
                    ? "50%"
                    : snapPreview === "left-wide"
                      ? "66.66%"
                      : snapPreview === "right-narrow"
                        ? "33.33%"
                        : snapPreview === "three-col-left" ||
                          snapPreview === "three-col-center" ||
                          snapPreview === "three-col-right"
                          ? "33.33%"
                          : snapPreview === "center-wide-left" ||
                            snapPreview === "center-wide-right"
                            ? "25%"
                            : snapPreview === "center-wide-center"
                              ? "50%"
                              : "50%",
              height:
                snapPreview === "maximize" ||
                  snapPreview === "left" ||
                  snapPreview === "right" ||
                  snapPreview === "left-wide" ||
                  snapPreview === "right-narrow" ||
                  snapPreview === "three-col-left" ||
                  snapPreview === "three-col-center" ||
                  snapPreview === "three-col-right" ||
                  snapPreview === "center-wide-left" ||
                  snapPreview === "center-wide-center" ||
                  snapPreview === "center-wide-right"
                  ? "100%"
                  : "50%",
              margin: 0,
            }}
          />,
          document.body
        )}
      {!isMinimized && (
        <>
          {isMaximized || snapType ? (
            <div
              ref={windowRef}
              className={`absolute ${isMaximized ? "maximized-window" : "snapped-window"}`}
              onMouseDownCapture={bringToFront}
              style={isMaximized ? {
                zIndex: zIndex,
                willChange: "auto",
                backfaceVisibility: "visible",
                color: "var(--text-primary)",
              } : {
                ...getSnapStyles(snapType),
                color: "var(--text-primary)",
              }}
            >
              <div
                className={`window-container ${isMaximized ? "maximized-window" : "snapped-window"} bg-white/90 dark:bg-gray-900/90 backdrop-blur-md flex flex-col`}
                onClick={bringToFront}
                style={{ width: "100%", height: "100%" }}
              >
                <div
                  className="window-drag-handle relative z-50"
                  onMouseDown={!isMaximized ? handleSnapDragStart : undefined}
                >
                  <span className="font-semibold text-sm truncate">{title}</span>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleButtonClick(handleMinimize)}
                      className="window-button"
                      onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                      onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                      onMouseDown={(e) => handleButtonAnimation(e, "down")}
                      onMouseUp={(e) => handleButtonAnimation(e, "up")}
                    >
                      <Minus size={14} />
                    </button>
                    {!isMobile && (
                      <div className="relative" onMouseLeave={handleMaximizeLeave}>
                        <button
                          onClick={() => handleButtonClick(toggleMaximize)}
                          className="window-button"
                          onMouseEnter={(e) => {
                            handleButtonAnimation(e, "enter");
                            handleMaximizeHover();
                          }}
                          onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                          onMouseDown={(e) => handleButtonAnimation(e, "down")}
                          onMouseUp={(e) => handleButtonAnimation(e, "up")}
                        >
                          {isMaximized ? (
                            <Square size={14} />
                          ) : (
                            <Maximize size={14} />
                          )}
                        </button>
                        {showSnapMenu && (
                          <SnapMenu
                            onSnap={handleSnap}
                            onMouseEnter={handleMaximizeHover}
                            onMouseLeave={handleMaximizeLeave}
                          />
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => handleButtonClick(handleClose)}
                      className="window-button window-button-close"
                      onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                      onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                      onMouseDown={(e) => handleButtonAnimation(e, "down")}
                      onMouseUp={(e) => handleButtonAnimation(e, "up")}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div
                  ref={contentRef}
                  className="window-content"
                  data-width={contentWidth}
                >
                  <React.Suspense fallback={<CuteSuspenseFallback />}>
                    {React.Children.map(children, (child) =>
                      React.isValidElement(child)
                        ? React.cloneElement(child, {
                          windowWidth: contentWidth,
                        } as { windowWidth: number })
                        : child
                    )}
                  </React.Suspense>
                </div>
              </div>
            </div>
          ) : (
            <Rnd
              ref={rndRef}
              size={size}
              position={position}
              onDragStart={() => {
                bringToFront();
                setIsDragging(true);
              }}
              onDrag={handleDrag}
              onDragStop={handleDragStop}
              onResizeStart={() => {
                bringToFront();
                setIsDragging(true);
              }}
              onResizeStop={(e, direction, ref, delta, pos) => {
                setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
                setPosition(pos);
                setIsDragging(false);
              }}
              dragHandleClassName="window-drag-handle"
              onClick={bringToFront}
              onMouseDownCapture={bringToFront}
              minWidth={350}
              minHeight={300}
              default={{
                x: position.x,
                y: position.y,
                width: size.width,
                height: size.height,
              }}
              style={{ zIndex: zIndex }}
              className="window-container bg-white/90 dark:bg-gray-900/90 backdrop-blur-md"
            >
              <div className="window-drag-handle relative z-50">
                <span className="font-semibold text-sm truncate">{title}</span>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleButtonClick(handleMinimize)}
                    className="window-button"
                    onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                    onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                    onMouseDown={(e) => handleButtonAnimation(e, "down")}
                    onMouseUp={(e) => handleButtonAnimation(e, "up")}
                  >
                    <Minus size={14} />
                  </button>
                  {!isMobile && (
                    <div className="relative" onMouseLeave={handleMaximizeLeave}>
                      <button
                        onClick={() => handleButtonClick(toggleMaximize)}
                        className="window-button"
                        onMouseEnter={(e) => {
                          handleButtonAnimation(e, "enter");
                          handleMaximizeHover();
                        }}
                        onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                        onMouseDown={(e) => handleButtonAnimation(e, "down")}
                        onMouseUp={(e) => handleButtonAnimation(e, "up")}
                      >
                        {isMaximized ? (
                          <Square size={14} />
                        ) : (
                          <Maximize size={14} />
                        )}
                      </button>
                      {showSnapMenu && (
                        <SnapMenu
                          onSnap={handleSnap}
                          onMouseEnter={handleMaximizeHover}
                          onMouseLeave={handleMaximizeLeave}
                        />
                      )}
                    </div>
                  )}
                  <button
                    onClick={() => handleButtonClick(handleClose)}
                    className="window-button window-button-close"
                    onMouseEnter={(e) => handleButtonAnimation(e, "enter")}
                    onMouseLeave={(e) => handleButtonAnimation(e, "leave")}
                    onMouseDown={(e) => handleButtonAnimation(e, "down")}
                    onMouseUp={(e) => handleButtonAnimation(e, "up")}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div
                ref={contentRef}
                className="window-content"
                data-width={contentWidth}
              >
                <React.Suspense fallback={<CuteSuspenseFallback />}>
                  {isDragging
                    ? null
                    : React.Children.map(children, (child) =>
                      React.isValidElement(child)
                        ? React.cloneElement(child, {
                          windowWidth: contentWidth,
                        } as { windowWidth: number })
                        : child
                    )}
                </React.Suspense>
              </div>
            </Rnd>
          )}
        </>
      )}
    </>
  );
}
