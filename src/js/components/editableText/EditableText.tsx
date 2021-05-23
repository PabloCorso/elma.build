import React, { useState, useEffect, useCallback } from "react";
import { ClickAwayListener, Input, Typography } from "@material-ui/core";

type Props = {
  value: string;
  showEditMode?: boolean;
  defaultEditMode?: boolean;
  readonly?: boolean;
  onChange: (value: string, isClickOutside?: boolean) => void;
  onStartEdit?: () => void;
};

const EditableText: React.FC<Props> = ({
  value,
  showEditMode = false,
  defaultEditMode = false,
  readonly = false,
  onChange,
  onStartEdit,
}) => {
  const [localValue, setLocalValue] = useState(value);
  useEffect(
    function updateLocalText() {
      setLocalValue(value);
    },
    [value]
  );

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    onStartEdit && onStartEdit();
  }, [onStartEdit]);

  const [isEditing, setIsEditing] = useState(defaultEditMode);
  useEffect(
    function handleShowEditMode() {
      if (showEditMode && !isEditing) {
        handleStartEdit();
      }
    },
    [showEditMode, handleStartEdit, isEditing]
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const pressedEnter = event.key === "Enter";
    if (pressedEnter) {
      handleSubmit();
    }
  };

  const handleSubmit = (isClickOutside = false) => {
    if (isEditing) {
      onChange(localValue, isClickOutside);
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  const handleClickAway = () => {
    handleSubmit(true);
  };

  return !readonly && isEditing ? (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Input
        type="text"
        value={localValue}
        onChange={(event) => {
          setLocalValue(event.target.value);
        }}
        autoFocus
        onBlur={() => {
          handleSubmit(true);
        }}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          event.stopPropagation();
        }}
        onFocus={(event) => event.target.select()}
      />
    </ClickAwayListener>
  ) : (
    <Typography
      variant="body1"
      style={{ cursor: "text" }}
      onDoubleClick={handleStartEdit}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      {value}
    </Typography>
  );
};

export default EditableText;
