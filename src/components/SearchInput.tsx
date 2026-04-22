import { useState, useRef, useEffect } from "react";
import { towns } from "@/lib/data/towns";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  provinceFilter?: string; // optional: pre-filter by provinceSlug
}

export function SearchInput({ value, onChange, placeholder = "Search towns...", provinceFilter }: SearchInputProps) {
  const [predictions, setPredictions] = useState<typeof towns>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    if (value.trim().length < 1) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    const q = value.toLowerCase();
    const matches = towns
      .filter(t => {
        const nameMatch = t.name.toLowerCase().includes(q);
        const provinceMatch = provinceFilter ? t.provinceSlug === provinceFilter : true;
        return nameMatch && provinceMatch;
      })
      .slice(0, 6);

    setPredictions(matches);
    setIsOpen(matches.length > 0);
    setActiveIndex(-1);
  }, [value, provinceFilter]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(town: typeof towns[0]) {
    onChange(town.name);
    setIsOpen(false);
    
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, predictions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        handleSelect(predictions[activeIndex]);
      } else {
        setIsOpen(false); // just run the normal filter
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  // Highlight the matching part of the town name
  function highlightMatch(name: string, query: string) {
    const idx = name.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{name}</span>;
    return (
      <>
        {name.slice(0, idx)}
        <span className="font-semibold text-blue-600">{name.slice(idx, idx + query.length)}</span>
        {name.slice(idx + query.length)}
      </>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => predictions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg overflow-auto max-h-72">
          {predictions.map((town, i) => (
            <li
              key={town.slug}
              className={`flex items-center justify-between px-3 py-2 cursor-pointer text-sm transition-colors ${
                i === activeIndex ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              onMouseDown={() => handleSelect(town)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <span>{highlightMatch(town.name, value)}</span>
              <span className="text-xs text-gray-400 ml-3 shrink-0">
                {town.provinceSlug.replace(/-/g, " ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}