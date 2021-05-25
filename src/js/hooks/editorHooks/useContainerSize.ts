import { useRef } from "react";
import useElementSize from "../useElementSize";

function useContainerSize<T extends HTMLElement>(): {
  containerRef: React.MutableRefObject<T>;
  containerSize: DOMRect;
} {
  const containerRef = useRef<T>();
  const size = useElementSize(containerRef);
  const width = size ? size.width : 0;
  const height = size ? size.height : 0;
  return { containerRef, containerSize: { ...size, width, height } };
}

export default useContainerSize;
