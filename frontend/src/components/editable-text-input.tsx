import { useState, useRef } from "react";
import { Input } from "./ui/input";

export function EditableTextInput({
  baseValue,
  onUpdate,
  onDelete,
}: {
  baseValue: string;
  onUpdate: (newValue: string) => void;
  onDelete: () => void;
}) {
  const [inputValue, setInputValue] = useState(baseValue);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleBlur() {
    const trimmed = inputValue.trim();

    if (trimmed === "") {
      if (baseValue !== "") {
        setInputValue(baseValue); // fallback if empty
      } else {
        onDelete();
      }
      return;
    }

    // If unchanged
    if (trimmed !== baseValue) {
      onUpdate(trimmed);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      if (baseValue !== "") {
        setInputValue(baseValue);
        // Set timeout so inputValue are synced and wont mismatched
        setTimeout(() => {
          inputRef.current?.blur();
        }, 0);
      } else {
        onDelete();
      }
    }
  }

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      autoFocus={baseValue === ""}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="shadow-none border-0 h-6"
    />
  );
}
