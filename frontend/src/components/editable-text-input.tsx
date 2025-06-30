import { useState, useRef } from "react";
import { Input } from "./ui/input";

/**
 * An editable text input component that allows inline editing of a string value.
 *
 * @param baseValue - The initial value to display in the input.
 * @param onUpdate - Callback invoked with the new value when the input is updated and not empty.
 * @param onDelete - Callback invoked when the input is cleared and the base value is also empty.
 * @param className - Optional additional CSS classes for styling the input.
 *
 * The component handles the following behaviors:
 * - Trims input on blur and updates or deletes based on the result.
 * - Pressing "Enter" blurs the input, triggering update logic.
 * - Pressing "Escape" reverts to the base value or deletes if the base value is empty.
 * - Autofocuses the input if the base value is empty.
 */
export function EditableTextInput({
  baseValue,
  onUpdate,
  onDelete,
  className,
  placeholder,
  forceLower = false,
}: {
  baseValue: string;
  onUpdate: (newValue: string) => void;
  onDelete: () => void;
  className?: string;
  placeholder?: string;
  forceLower?: boolean;
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
      name="editable-text-field"
      ref={inputRef}
      value={inputValue}
      autoFocus={baseValue === ""}
      onChange={(e) => {
        const changed = forceLower
          ? e.target.value.toLocaleLowerCase()
          : e.target.value;
        setInputValue(changed);
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`shadow-none border-0 !bg-transparent h-6 text-wrap ${className}`}
      placeholder={placeholder}
    />
  );
}
