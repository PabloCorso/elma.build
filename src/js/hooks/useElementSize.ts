import { useLayoutEffect, useState } from "react";
import useResizeObserver from "@react-hook/resize-observer";

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
