import React from "react";
import { Paper, Typography } from "@material-ui/core";
import { TemplateBlock } from "../../types";
import EditableText from "../editableText";
import "./blockCard.css";

export type Props = {
  block: TemplateBlock;
  readonly?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onRename?: (name: string) => void;
};

const BlockCard: React.FC<Props> = ({
  block,
  readonly = false,
  onClick,
  onRename,
}) => {
  const handleChange = (value: string) => {
    if (!readonly) {
      onRename && onRename(value);
    }
  };

  return (
    <Paper elevation={1} className="block-card" onClick={onClick}>
      {readonly && <Typography variant="body1">{block.name}</Typography>}
      {!readonly && (
        <EditableText
          value={block.name}
          onChange={handleChange}
          defaultEditMode={!readonly}
        />
      )}
    </Paper>
  );
};

export default BlockCard;
