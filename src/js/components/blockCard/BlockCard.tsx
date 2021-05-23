import React from "react";
import { Paper } from "@material-ui/core";
import { TemplateBlock } from "../../types";
import EditableText from "../editableText";
import "./blockCard.css";

export type Props = {
  block: TemplateBlock;
  readonly?: boolean;
  onRename?: (name: string) => void;
};

const BlockCard: React.FC<Props> = ({ block, readonly = false, onRename }) => {
  const handleChange = (value: string) => {
    if (!readonly) {
      onRename && onRename(value);
    }
  };

  return (
    <Paper elevation={1} className="block-card">
      <EditableText
        value={block.name}
        onChange={handleChange}
        defaultEditMode={!readonly}
        readonly={readonly}
      />
    </Paper>
  );
};

export default BlockCard;
