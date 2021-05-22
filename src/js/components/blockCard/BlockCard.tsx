import React from "react";
import { Paper } from "@material-ui/core";
import { TemplateBlock } from "../../types";
import EditableText from "../editableText";
import "./blockCard.css";

export type Props = {
  block: TemplateBlock;
  onRename: (name: string) => void;
};

const BlockCard: React.FC<Props> = ({ block, onRename }) => {
  return (
    <Paper elevation={1} className="block-card">
      <EditableText value={block.name} onChange={onRename} defaultEditMode />
    </Paper>
  );
};

export default BlockCard;
