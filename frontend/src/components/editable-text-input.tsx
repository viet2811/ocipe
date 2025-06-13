import { useState, useRef } from "react";
import { Input } from "./ui/input";

export function EditableTextInput({
  baseValue,
  onUpdate,
}: {
  baseValue: string;
  onUpdate: (newValue: string) => void;
}) {
  const [inputValue, setInputValue] = useState(baseValue);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleBlur() {
    const trimmed = inputValue.trim();

    if (trimmed === "") {
      setInputValue(baseValue); // fallback if empty
      return;
    }

    if (trimmed !== baseValue) {
      onUpdate(trimmed);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setInputValue(inputValue);
      inputRef.current?.blur();
    }
  }

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="shadow-none border-0 h-6"
    />
  );
}
