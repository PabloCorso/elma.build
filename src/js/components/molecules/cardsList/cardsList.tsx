import React from "react";
import cn from "classnames";
import { BlockProps } from "../blockCard";
import "./cardsList.css";

type Props = {
  children?: React.ReactElement<BlockProps>[];
  className?: string;
};

const BlockCards: React.FC<Props> = ({ children, className }) => {
  const rootClassName = cn("cards-list", className);
  return <ul className={rootClassName}>{children}</ul>;
};

export default BlockCards;
