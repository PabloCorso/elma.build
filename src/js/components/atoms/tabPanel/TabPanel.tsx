import React from "react";
import cn from "classnames";
import "./tabPanel.css";

type Props = {
  value: number;
  index: number;
} & React.HtmlHTMLAttributes<HTMLDivElement>;

const TabPanel: React.FC<Props> = ({
  value,
  index,
  className,
  children,
  ...props
}) => {
  return (
    <div
      role="tabpanel"
      className={cn(className, "tab-panel")}
      hidden={value !== index}
      {...props}
    >
      {value === index && children}
    </div>
  );
};

export default TabPanel;
