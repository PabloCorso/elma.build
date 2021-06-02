import React from "react";
import cn from "classnames";
import { BlockProps } from "../blockCard";
import "./cardsList.css";

type Props = {
  title?: string;
  children?: React.ReactElement<BlockProps>[];
  className?: string;
};

const BlockCards: React.FC<Props> = ({ title = "", children, className }) => {
  const listClassName = cn("cards-list__items", className);
  return (
    <div className="cards-list">
      {title && <h3 className="cards-list__title">{title}</h3>}
      <ul className={listClassName}>{children}</ul>
    </div>
  );
};

export default BlockCards;
