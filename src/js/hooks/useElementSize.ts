import { useLayoutEffect, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";
// import { RefObject, useState, useEffect, useCallback } from "react";
// import useEventListener from "./useEventListener";

// interface Size {
//   width: number;
//   height: number;
// }

// function useElementSize<T extends HTMLElement = HTMLDivElement>(
//   elementRef: RefObject<T>
// ): Size {
//   const [size, setSize] = useState<Size>({
//     width: 0,
//     height: 0,
//   });

//   // Prevent too many rendering using useCallback
//   const updateSize = useCallback(() => {
//     const node = elementRef?.current;
//     if (node) {
//       setSize({
//         width: node.offsetWidth || 0,
//         height: node.offsetHeight || 0,
//       });
//     }
//   }, [elementRef]);

//   // Initial size on mount
//   useEffect(() => {
//     updateSize();
//   }, []);

//   useEventListener("resize", updateSize);

//   return size;
// }

function useElementSize<T extends HTMLElement>(
  target: React.RefObject<T>
): DOMRect {
  const [size, setSize] = useState<DOMRect>();

  useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect());
  }, [target]);

  useResizeObserver(target, (entry) => {
    console.log(entry.contentRect);
    setSize(entry.contentRect);
  });
  return size;
}

export default useElementSize;
