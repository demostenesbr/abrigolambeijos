import { memo, useEffect, useState } from "react";

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  delay?: number;
  className?: string;
}

// O texto digitado fica no próprio input; a página só é notificada após o debounce.
const SearchInput = memo(function SearchInput({
  onSearch,
  placeholder,
  ariaLabel,
  delay = 250,
  className = "w-full rounded-xl border border-[#E5DCEB] px-4 py-3 text-sm outline-none focus:border-[#4D246A] sm:max-w-md",
}: SearchInputProps) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => onSearch(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay, onSearch]);

  return (
    <input
      type="text"
      inputMode="search"
      autoComplete="off"
      spellCheck={false}
      aria-label={ariaLabel}
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
});

export default SearchInput;
