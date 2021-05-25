import React, { forwardRef } from "react";
import cn from "classnames";

const EditorStageContinaer = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      tabIndex={1}
      {...props}
      className={cn(className, "editor-stage-container")}
      ref={ref}
    ></div>
  );
});

export default EditorStageContinaer;
