import { useEffect, useRef, useState } from "react";

const useResizable = () => {
  const resizeRef = useRef(null);
  const [chartHeight, setChartHeight] = useState(600);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [chartWidth, setChartWidth] = useState(
    screenWidth > 800 ? 800 : screenWidth - 40
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const resizeHandle = resizeRef.current;
    if (!resizeHandle) return;

    let isResizing = false;
    let startX = 0,
      startY = 0;

    const handleResizeStart = (clientX, clientY) => {
      isResizing = true;
      startX = clientX;
      startY = clientY;
    };

    const handleResizeMove = (clientX, clientY) => {
      if (!isResizing) return;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

      setChartWidth((prev) => prev + deltaX);
      setChartHeight((prev) => prev + deltaY);

      startX = clientX;
      startY = clientY;
    };

    const handleResizeEnd = () => {
      isResizing = false;
    };

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      handleResizeStart(touch.clientX, touch.clientY);
      document.addEventListener("touchmove", onTouchMove);
      document.addEventListener("touchend", onTouchEnd);
    };

    const onTouchMove = (e) => {
      const touch = e.touches[0];
      handleResizeMove(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
      handleResizeEnd();
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };

    const onMouseDown = (e) => {
      handleResizeStart(e.clientX, e.clientY);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (e) => {
      handleResizeMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      handleResizeEnd();
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    if (screenWidth < 500) {
      resizeHandle.addEventListener("touchstart", onTouchStart);
    } else {
      resizeHandle.addEventListener("mousedown", onMouseDown);
    }

    return () => {
      resizeHandle.removeEventListener("touchstart", onTouchStart);
      resizeHandle.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [resizeRef, screenWidth]);

  return { resizeRef, chartWidth, chartHeight };
};

export default useResizable;
